# Loading Components Usage Guide

This guide explains how to use the global loading spinner components in your Gadget Brust application.

## 🎯 **Components Available:**

### 1. **Global Loading Overlay** (`LoadingProvider`)
- Full-screen loading overlay with backdrop
- Managed globally through context
- Perfect for major operations (login, data fetching, etc.)

### 2. **Standalone Loader** (`Loader`)
- Reusable spinner component
- Multiple sizes available
- Perfect for specific sections or buttons

### 3. **Inline Loader** (`InlineLoader`)
- Small, inline spinner
- Perfect for buttons, small sections
- Includes optional message

## 🚀 **Usage Examples:**

### **Global Loading (Recommended for major operations):**

```jsx
import { useLoadingState } from '@/lib/hooks/useLoading';

function MyComponent() {
  const { showLoading, hideLoading, withLoading } = useLoadingState();

  // Method 1: Manual control
  const handleLogin = async () => {
    showLoading('Logging in...');
    try {
      await loginUser();
    } finally {
      hideLoading();
    }
  };

  // Method 2: Automatic wrapper (recommended)
  const handleDataFetch = async () => {
    const result = await withLoading(
      () => fetchData(),
      'Loading data...'
    );
    return result;
  };

  return (
    <button onClick={handleLogin}>
      Login
    </button>
  );
}
```

### **Standalone Loader (For specific sections):**

```jsx
import Loader from '@/components/ui/loader';

function ProductCard({ loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader size="medium" />
      </div>
    );
  }

  return <div>Product content...</div>;
}
```

### **Inline Loader (For buttons/small areas):**

```jsx
import InlineLoader from '@/components/ui/inline-loader';

function SubmitButton({ isSubmitting }) {
  return (
    <button disabled={isSubmitting}>
      {isSubmitting ? (
        <InlineLoader message="Saving..." />
      ) : (
        'Save Changes'
      )}
    </button>
  );
}
```

## 📏 **Size Options:**

### **Loader Component:**
- `small` - 24px (6x6 in Tailwind)
- `medium` - 48px (12x12 in Tailwind) - **Default**
- `large` - 64px (16x16 in Tailwind)
- `xl` - 80px (20x20 in Tailwind)

### **InlineLoader Component:**
- `small` - 16px (4x4 in Tailwind) - **Default**
- `medium` - 24px (6x6 in Tailwind)

## 🎨 **Customization:**

### **Custom Colors:**
```jsx
<Loader 
  size="large" 
  className="text-blue-500" 
/>
```

### **Custom Positioning:**
```jsx
<div className="relative">
  <Loader 
    size="medium" 
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
  />
</div>
```

## 🔧 **Advanced Usage:**

### **Multiple Operations:**
```jsx
const { withMultipleLoading } = useLoadingState();

const handleMultipleOperations = async () => {
  const results = await withMultipleLoading([
    fetchUserData(),
    fetchProducts(),
    fetchCategories()
  ], 'Loading all data...');
  
  return results;
};
```

### **Conditional Loading:**
```jsx
function DataTable({ data, loading }) {
  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader size="large" />
        </div>
      ) : (
        <table>
          {/* Table content */}
        </table>
      )}
    </div>
  );
}
```

## 🎯 **Best Practices:**

1. **Use Global Loading** for:
   - Authentication operations
   - Major data fetching
   - Form submissions
   - Navigation between pages

2. **Use Standalone Loader** for:
   - Individual component loading states
   - Section-specific loading
   - Cards or tiles loading

3. **Use Inline Loader** for:
   - Button loading states
   - Small form elements
   - Inline operations

4. **Always provide meaningful messages** for better UX

5. **Handle errors properly** - always hide loading on error

## 🚨 **Error Handling:**

```jsx
const handleOperation = async () => {
  try {
    await withLoading(
      () => riskyOperation(),
      'Processing...'
    );
  } catch (error) {
    // Loading is automatically hidden
    console.error('Operation failed:', error);
  }
};
```

## 📱 **Responsive Considerations:**

The loaders are designed to work well on all screen sizes. For mobile, consider using smaller sizes:

```jsx
<Loader size={isMobile ? 'small' : 'medium'} />
```

## 🎨 **Styling Notes:**

- All loaders use CSS-in-JS for animations
- Colors can be customized via CSS classes
- Animations are smooth and performant
- No external dependencies required


