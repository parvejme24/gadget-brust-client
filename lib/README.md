# API Integration with React Query and Redux Toolkit

This directory contains the complete API integration setup for the Gadget Brust client application using React Query and Redux Toolkit.

## 📁 Directory Structure

```
lib/
├── api.js                    # Axios instance with interceptors
├── services/                 # API service functions
│   ├── authService.js       # Authentication API calls
│   ├── brandService.js      # Brand management API calls
│   ├── categoryService.js   # Category management API calls
│   ├── productService.js    # Product management API calls
│   ├── cartService.js       # Cart management API calls
│   ├── reviewService.js     # Review management API calls
│   └── wishlistService.js   # Wishlist management API calls
├── store/                    # Redux store configuration
│   ├── index.js             # Store setup and configuration
│   └── slices/              # Redux slices
│       ├── authSlice.js      # Authentication state management
│       ├── brandSlice.js     # Brand state management
│       ├── categorySlice.js  # Category state management
│       ├── productSlice.js   # Product state management
│       ├── cartSlice.js      # Cart state management
│       ├── reviewSlice.js    # Review state management
│       └── wishlistSlice.js  # Wishlist state management
├── hooks/                    # Custom hooks
│   ├── redux.js             # Redux typed hooks
│   ├── useAuth.js           # Authentication React Query hooks
│   ├── useBrands.js         # Brand React Query hooks
│   ├── useCategories.js     # Category React Query hooks
│   ├── useProducts.js       # Product React Query hooks
│   ├── useCart.js           # Cart React Query hooks
│   ├── useReviews.js        # Review React Query hooks
│   └── useWishlist.js       # Wishlist React Query hooks
├── providers/                # Context providers
│   ├── ReduxProvider.jsx    # Redux store provider
│   └── QueryProvider.jsx   # React Query client provider
└── README.md                # This file
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_API_URL=https://gadget-brust-server.vercel.app/api
```

### 2. Providers Setup

The providers are already configured in `app/layout.js`:

```jsx
import ReduxProvider from "@/lib/providers/ReduxProvider";
import QueryProvider from "@/lib/providers/QueryProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
```

## 🔧 Usage Examples

### Using React Query Hooks

```jsx
"use client"
import { useAllProducts, useCreateProduct } from '@/lib/hooks/useProducts';

export default function ProductsPage() {
  const { data: products, isLoading, error } = useAllProducts();
  const createProduct = useCreateProduct();

  const handleCreateProduct = (productData) => {
    createProduct.mutate(productData, {
      onSuccess: () => {
        console.log('Product created successfully!');
      },
      onError: (error) => {
        console.error('Failed to create product:', error);
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {products?.map(product => (
        <div key={product._id}>{product.title}</div>
      ))}
    </div>
  );
}
```

### Using Redux Toolkit

```jsx
"use client"
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { getAllProducts, createProduct } from '@/lib/store/slices/productSlice';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, isLoading, error } = useAppSelector(state => state.products);

  const handleLoadProducts = () => {
    dispatch(getAllProducts());
  };

  const handleCreateProduct = (productData) => {
    dispatch(createProduct(productData));
  };

  return (
    <div>
      <button onClick={handleLoadProducts}>Load Products</button>
      {products?.map(product => (
        <div key={product._id}>{product.title}</div>
      ))}
    </div>
  );
}
```

### Using Both Together

```jsx
"use client"
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { useAllProducts, useCreateProduct } from '@/lib/hooks/useProducts';
import { getAllProducts } from '@/lib/store/slices/productSlice';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products: reduxProducts } = useAppSelector(state => state.products);
  
  // React Query for automatic caching and background updates
  const { data: queryProducts, isLoading } = useAllProducts();
  
  // Redux for global state management
  const handleLoadProducts = () => {
    dispatch(getAllProducts());
  };

  // Use React Query data as primary source
  const products = queryProducts || reduxProducts;

  return (
    <div>
      <button onClick={handleLoadProducts}>Load Products (Redux)</button>
      {products?.map(product => (
        <div key={product._id}>{product.title}</div>
      ))}
    </div>
  );
}
```

## 📋 Available Hooks

### Authentication Hooks

```jsx
// Queries
const { data: profile } = useAuthProfile();
const { data: users } = useAllUsers();
const { data: user } = useUserById(userId);
const { data: user } = useUserByEmail(email);

// Mutations
const login = useLogin();
const register = useRegister();
const logout = useLogout();
const updateProfile = useUpdateProfile();
const createUser = useCreateUser();
const updateUser = useUpdateUser();
const deleteUser = useDeleteUser();
```

### Brand Hooks

```jsx
// Queries
const { data: brands } = useAllBrands();
const { data: brand } = useBrandById(brandId);

// Mutations
const createBrand = useCreateBrand();
const updateBrand = useUpdateBrand();
const deleteBrand = useDeleteBrand();
```

### Category Hooks

```jsx
// Queries
const { data: categories } = useAllCategories();
const { data: category } = useCategoryById(categoryId);
const { data: subcategories } = useCategorySubcategories(categoryId);

// Mutations
const createCategory = useCreateCategory();
const updateCategory = useUpdateCategory();
const deleteCategory = useDeleteCategory();
const addSubcategory = useAddSubcategory();
const updateSubcategory = useUpdateSubcategory();
const deleteSubcategory = useDeleteSubcategory();
```

### Product Hooks

```jsx
// Queries
const { data: products } = useAllProducts(params);
const { data: sliderProducts } = useSliderProducts();
const { data: discountedProducts } = useDiscountedProducts();
const { data: cheapestProducts } = useCheapestProducts();
const { data: newestProducts } = useNewestProducts();
const { data: categoryProducts } = useProductsByCategory(categoryId);
const { data: brandProducts } = useProductsByBrand(brandId);
const { data: remarkProducts } = useProductsByRemark(remark);
const { data: product } = useProductById(productId);

// Mutations
const createProduct = useCreateProduct();
const updateProduct = useUpdateProduct();
const deleteProduct = useDeleteProduct();
```

### Cart Hooks

```jsx
// Queries
const { data: cartItems } = useUserCart(userId);
const { data: cartSummary } = useCartSummary(userId);
const { data: cartItem } = useCartItemById(cartItemId);
const { data: allCarts } = useAllCarts();

// Mutations
const addToCart = useAddToCart();
const updateCartItem = useUpdateCartItem();
const updateQuantity = useUpdateQuantity();
const removeFromCart = useRemoveFromCart();
const clearUserCart = useClearUserCart();
```

### Review Hooks

```jsx
// Queries
const { data: reviews } = useAllReviews();
const { data: productReviews } = useReviewsByProduct(productId);
const { data: customerReviews } = useReviewsByCustomer(customerId);
const { data: review } = useReviewById(reviewId);

// Mutations
const createReview = useCreateReview();
const updateReview = useUpdateReview();
const deleteReview = useDeleteReview();
```

### Wishlist Hooks

```jsx
// Queries
const { data: wishlistItems } = useUserWishlist(userId);
const { data: wishlistStatus } = useWishlistStatus(productId, customerEmail);
const { data: allWishlists } = useAllWishlists();

// Mutations
const addToWishlist = useAddToWishlist();
const removeFromWishlist = useRemoveFromWishlist();
const clearWishlist = useClearWishlist();
```

## 🔐 Authentication Flow

### Automatic Token Management

The API client automatically handles:
- Adding JWT tokens to requests
- Refreshing expired tokens
- Redirecting to login on auth failure

### Manual Token Management

```jsx
// Login and store tokens
const login = useLogin();
login.mutate({ email, password });

// Logout and clear tokens
const logout = useLogout();
logout.mutate();

// Check authentication status
const { isAuthenticated, user } = useAppSelector(state => state.auth);
```

## 🎯 Best Practices

### 1. Use React Query for Data Fetching

- Automatic caching and background updates
- Built-in loading and error states
- Optimistic updates
- Request deduplication

### 2. Use Redux for Global State

- User authentication state
- UI state management
- Complex state logic
- State that needs to persist across components

### 3. Error Handling

```jsx
const { data, error, isLoading } = useAllProducts();

if (error) {
  return <div>Error: {error.message}</div>;
}

if (isLoading) {
  return <div>Loading...</div>;
}
```

### 4. Optimistic Updates

```jsx
const updateProduct = useUpdateProduct();

const handleUpdate = (productData) => {
  updateProduct.mutate(productData, {
    onSuccess: () => {
      // Show success message
      toast.success('Product updated successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error('Failed to update product');
    }
  });
};
```

## 🔧 Configuration

### React Query Configuration

```jsx
// lib/providers/QueryProvider.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: (failureCount, error) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false; // Don't retry on 4xx errors
        }
        return failureCount < 3;
      },
    },
  },
});
```

### Redux Store Configuration

```jsx
// lib/store/index.js
export const store = configureStore({
  reducer: {
    auth: authSlice,
    brands: brandSlice,
    categories: categorySlice,
    products: productSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
```

## 🚨 Error Handling

### API Error Interceptor

The API client automatically handles:
- 401 errors (token refresh)
- Network errors
- Server errors

### Component Error Handling

```jsx
const { data, error, isLoading } = useAllProducts();

if (error) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={() => refetch()}>Try Again</button>
    </div>
  );
}
```

## 📱 Example Components

Check out the example components in `components/examples/`:
- `AuthExample.jsx` - Authentication with both Redux and React Query
- `ProductExample.jsx` - Product management with both approaches

## 🔗 API Endpoints

The integration supports all your backend API endpoints:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `DELETE /auth/profile` - Delete user profile

### Admin Routes
- `POST /auth/users` - Create user (admin)
- `GET /auth/users` - Get all users (admin)
- `GET /auth/users/:id` - Get user by ID (admin)
- `PUT /auth/users/:id` - Update user (admin)
- `DELETE /auth/users/:id` - Delete user (admin)

### Brands
- `POST /brands` - Create brand
- `GET /brands` - Get all brands
- `GET /brands/:id` - Get brand by ID
- `PUT /brands/:id` - Update brand
- `DELETE /brands/:id` - Delete brand

### Categories
- `POST /categories` - Create category
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `POST /categories/:id/subcategories` - Add subcategory
- `PUT /categories/:id/subcategories` - Update subcategory
- `DELETE /categories/:id/subcategories` - Delete subcategory

### Products
- `POST /products` - Create product
- `GET /products` - Get all products
- `GET /products/slider` - Get slider products
- `GET /products/discounted` - Get discounted products
- `GET /products/cheapest` - Get cheapest products
- `GET /products/newest` - Get newest products
- `GET /products/category/:categoryId` - Get products by category
- `GET /products/brand/:brandId` - Get products by brand
- `GET /products/remark/:remark` - Get products by remark
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Cart
- `POST /cart` - Add item to cart
- `GET /cart` - Get all carts (admin)
- `GET /cart/user/:userId` - Get user's cart
- `GET /cart/user/:userId/summary` - Get cart summary
- `GET /cart/:id` - Get cart item by ID
- `PUT /cart/:id` - Update cart item
- `PATCH /cart/:id/quantity` - Update cart item quantity
- `DELETE /cart/:id` - Remove item from cart
- `DELETE /cart/user/:userId/clear` - Clear user's cart

### Reviews
- `POST /reviews` - Create review
- `GET /reviews` - Get all reviews (admin)
- `GET /reviews/product/:productId` - Get reviews by product
- `GET /reviews/customer/:customerId` - Get reviews by customer
- `GET /reviews/:id` - Get review by ID
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Wishlist
- `POST /wishlist` - Add item to wishlist
- `GET /wishlist` - Get all wishlists (admin)
- `GET /wishlist/user/:userId` - Get user's wishlist
- `GET /wishlist/check` - Check wishlist status
- `DELETE /wishlist/:id` - Remove item from wishlist
- `DELETE /wishlist/:userId/clear` - Clear user's wishlist

## 🎉 You're Ready!

Your API integration is now complete and ready to use. You can:

1. Use React Query hooks for data fetching with automatic caching
2. Use Redux Toolkit for global state management
3. Use both together for maximum flexibility
4. Handle authentication automatically
5. Manage all your API endpoints with type safety

Happy coding! 🚀
