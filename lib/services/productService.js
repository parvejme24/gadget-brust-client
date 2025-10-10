import api from "../api";

// Get the base URL for debugging
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// product service functions
export const productService = {
  // create new product
  createProduct: async (productData) => {
    console.log("Creating product with data:", productData);

    const formData = new FormData();

    // Handle image file upload
    if (productData.image) {
      console.log("Appending image to FormData:", {
        name: productData.image.name,
        type: productData.image.type,
        size: productData.image.size,
        constructor: productData.image.constructor.name,
      });

      // Final check before appending
      if (productData.image.name === "blob") {
        console.error(
          "ERROR: File still has blob name! This will be rejected by server."
        );
        throw new Error("File has invalid name: blob");
      }

      formData.append("image", productData.image);
    } else {
      console.log("No image file provided");
    }

    // Send other data
    const { image, ...otherData } = productData;
    Object.keys(otherData).forEach((key) => {
      if (
        otherData[key] !== undefined &&
        otherData[key] !== null &&
        otherData[key] !== ""
      ) {
        if (key === "keyFeatures" && Array.isArray(otherData[key])) {
          // Send keyFeatures as JSON string for better server parsing
          formData.append("keyFeatures", JSON.stringify(otherData[key]));
        } else if (key === "isSlider") {
          // Convert boolean to string
          formData.append(key, otherData[key].toString());
        } else {
          formData.append(key, otherData[key]);
        }
      }
    });

    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      if (key === "image") {
        console.log(key, {
          name: value.name,
          type: value.type,
          size: value.size,
          lastModified: value.lastModified,
          constructor: value.constructor.name,
          isFile: value instanceof File,
          isBlob: value instanceof Blob,
        });
      } else {
        console.log(key, value);
      }
    }

    // Additional debugging for image file
    if (productData.image) {
      console.log("Original image file details:", {
        name: productData.image.name,
        type: productData.image.type,
        size: productData.image.size,
        lastModified: productData.image.lastModified,
        constructor: productData.image.constructor.name,
        isFile: productData.image instanceof File,
        isBlob: productData.image instanceof Blob,
      });
    }

    try {
      console.log("Sending request to:", baseURL + "/products");
      console.log("Request headers will be set by axios for FormData");

      const response = await api.post("/products", formData, {
        headers: {
          // Don't set Content-Type manually - let the browser set it with boundary
          // 'Content-Type': 'multipart/form-data', // Remove this line
        },
      });
      console.log("Product created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });

      // Additional debugging for image-related errors
      if (error.response?.data?.message?.includes("image files")) {
        console.error("Image validation failed. Checking file details...");
        const imageFile = formData.get("image");
        if (imageFile) {
          console.error("Image file being sent:", {
            name: imageFile.name,
            type: imageFile.type,
            size: imageFile.size,
            constructor: imageFile.constructor.name,
          });

          // Try to read the file to see if it's valid
          const reader = new FileReader();
          reader.onload = (e) => {
            console.error(
              "File content preview (first 100 chars):",
              e.target.result.substring(0, 100)
            );
          };
          reader.readAsText(imageFile.slice(0, 100));
        } else {
          console.error("No image file found in FormData");
        }

        // Log all FormData entries
        console.error("All FormData entries:");
        for (let [key, value] of formData.entries()) {
          if (key === "image") {
            console.error(`${key}: [File object]`, {
              name: value.name,
              type: value.type,
              size: value.size,
            });
          } else {
            console.error(`${key}:`, value);
          }
        }
      }

      throw error;
    }
  },

  // get all products
  getAllProducts: async (params = {}) => {
    const response = await api.get("/products", { params });
    // The API returns { success: true, message: "...", data: { products: [...] } }
    // But we need to return { data: [...] } for consistency
    return {
      data: response.data.data.products,
      pagination: response.data.data.pagination,
    };
  },

  // get slider products
  getSliderProducts: async () => {
    const response = await api.get("/products/slider");
    return {
      data: response.data.data.products || response.data.data,
    };
  },

  // get discounted products
  getDiscountedProducts: async () => {
    const response = await api.get("/products/discounted");
    return {
      data: response.data.data.products || response.data.data,
    };
  },

  // get cheapest products
  getCheapestProducts: async () => {
    const response = await api.get("/products/cheapest");
    return {
      data: response.data.data.products || response.data.data,
    };
  },

  // get newest products
  getNewestProducts: async () => {
    const response = await api.get("/products/newest");
    return {
      data: response.data.data.products || response.data.data,
    };
  },

  // get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return {
      data: response.data.data.products || response.data.data,
    };
  },

  // get products by subcategory
  getProductsBySubcategory: async (subcategoryName) => {
    const response = await api.get(`/products/subcategory/${subcategoryName}`);
    return {
      data: response.data.data.products || response.data.data,
    };
  },

  // get products by category and subcategory
  getProductsByCategoryAndSubcategory: async (categoryId, subcategoryName) => {
    const response = await api.get(
      `/products/category/${categoryId}/subcategory/${subcategoryName}`
    );
    return {
      data: response.data.data.products || response.data.data,
    };
  },

  // get products by brand
  getProductsByBrand: async (brandId) => {
    const response = await api.get(`/products/brand/${brandId}`);
    return {
      data: response.data.data.products || response.data.data,
    };
  },

  // get products by remark
  getProductsByRemark: async (remark) => {
    const response = await api.get(`/products/remark/${remark}`);
    return {
      data: response.data.data.products || response.data.data,
    };
  },

  // get product by id
  getProductById: async (productId) => {
    console.log("Fetching product by ID:", productId);
    console.log("Full URL:", baseURL + `/products/${productId}`);

    try {
      const response = await api.get(`/products/${productId}`);
      console.log("Product fetch successful:", response.data);
      return {
        data: response.data.data.product || response.data.data,
      };
    } catch (error) {
      console.error("Error fetching product by ID:", {
        productId,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  // update product
  updateProduct: async (productId, productData) => {
    console.log("Updating product with data:", productData);
    console.log("Product ID for update:", productId);
    console.log("Product ID type:", typeof productId);
    console.log("Full update URL:", baseURL + `/products/${productId}`);

    // Validate productId before proceeding
    if (!productId || productId === "undefined" || productId === "null") {
      throw new Error("Invalid product ID provided for update");
    }

    // Validate MongoDB ObjectId format (24 hex characters)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(productId)) {
      console.error("Invalid MongoDB ObjectId format:", productId);
      throw new Error(
        "Invalid product ID format - must be 24 character hex string"
      );
    }

    const formData = new FormData();

    // Handle image file upload
    if (productData.image) {
      formData.append("image", productData.image);
    }

    // Send other data - only include fields that exist and have values
    const { image, ...otherData } = productData;
    Object.keys(otherData).forEach((key) => {
      if (otherData[key] !== undefined && otherData[key] !== null) {
        if (key === "keyFeatures" && Array.isArray(otherData[key])) {
          // Always send keyFeatures, even if empty array
          formData.append("keyFeatures", JSON.stringify(otherData[key]));
        } else if (key === "isSlider") {
          // Convert boolean to string
          formData.append(key, otherData[key].toString());
        } else if (otherData[key] !== "") {
          // Only skip empty strings for other fields
          formData.append(key, otherData[key]);
        }
      }
    });

    console.log("FormData contents for update:");
    for (let [key, value] of formData.entries()) {
      if (key === "image") {
        console.log(key, {
          name: value.name,
          type: value.type,
          size: value.size,
          lastModified: value.lastModified,
        });
      } else {
        console.log(key, value);
      }
    }

    try {
      // Use original URL pattern (confirmed working)
      const updateUrl = `/products/${productId}`;
      console.log("Update URL:", updateUrl);
      console.log("Full URL:", baseURL + updateUrl);

      // Debug: Check if FormData has any entries
      console.log(
        "FormData entries count:",
        Array.from(formData.entries()).length
      );
      console.log("FormData keys:", Array.from(formData.keys()));

      console.log("Making PUT request to:", baseURL + updateUrl);
      console.log("Request will be made with FormData");

      // Check authentication token
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      console.log("Auth token present:", !!token);
      console.log(
        "Token preview:",
        token ? token.substring(0, 20) + "..." : "No token"
      );

      // Use PUT method directly (confirmed working)
      console.log('Using PUT method for update...');
      const response = await api.put(updateUrl, formData, {
        // Don't set Content-Type manually - let browser set it with boundary
        timeout: 30000,
      });

      console.log("✅ Product updated successfully!");
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update API Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });
      throw error;
    }
  },

  // delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};
