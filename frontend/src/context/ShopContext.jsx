import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "₹";
    const delivery_fee = 100;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [wishlistItems, setWishlistItems] = useState({}); // Wishlist state
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const addToWishlist = async (itemId, size) => {
        console.log("Adding to wishlist", itemId, size);
        let wishlistData = structuredClone(wishlistItems);
        if (wishlistData[itemId]) {
            if (wishlistData[itemId][size]) {
                wishlistData[itemId][size] += 1;
            } else {
                wishlistData[itemId][size] = 1;
            }
        } else {
            wishlistData[itemId] = {};
            wishlistData[itemId][size] = 1;
        }

        console.log("Updated wishlist:", wishlistData);

        setWishlistItems(wishlistData);

        if (token) {
            try {
                const response = await axios.post(
                    backendUrl + "/api/wishlist/add",
                    { itemId, size },
                    { headers: { token } }
                );

                toast.success(response.data.message);
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }
    };

    const getUserWishlist = async (userToken = token) => {
        if (userToken) {
            try {
                const response = await axios.post(
                    backendUrl + "/api/wishlist/get",
                    {},
                    { headers: { token: userToken } }
                );
                setWishlistItems(response.data.wishlist || {});
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }
    };

    const removeFromWishlist = async (itemId, size) => {
        let wishlistData = structuredClone(wishlistItems);
        if (wishlistData[itemId] && wishlistData[itemId][size]) {
            delete wishlistData[itemId][size];
            if (Object.keys(wishlistData[itemId]).length === 0) {
                delete wishlistData[itemId];
            }
        }
        setWishlistItems(wishlistData);

        if (token) {
            try {
                const response = await axios.post(
                    backendUrl + "/api/wishlist/remove",
                    { itemId, size },
                    { headers: { token } }
                );
                toast.success(response.data.message);
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }
    };

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            const savedToken = localStorage.getItem("token");
            setToken(savedToken);
            getUserCart(savedToken); // Fetch cart data
            getUserWishlist(savedToken); // Fetch wishlist data
        }
    }, []);

    // Save wishlistItems to localStorage whenever it changes
    useEffect(() => {
        if (Object.keys(wishlistItems).length > 0) {
            localStorage.setItem(
                "wishlistItems",
                JSON.stringify(wishlistItems)
            ); // Save object structure
        }
    }, [wishlistItems]);

    // Load wishlistItems from localStorage when the component mounts
    useEffect(() => {
        const savedWishlist = localStorage.getItem("wishlistItems");
        if (savedWishlist) {
            const parsedWishlist = JSON.parse(savedWishlist);
            console.log("Loaded wishlist from local storage:", parsedWishlist);
            setWishlistItems(parsedWishlist); // Update state with loaded wishlist
        }
    }, []);

    // Cart and wishlist-related functions remain unchanged
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                const response = await axios.post(
                    backendUrl + "/api/cart/add",
                    { itemId, size },
                    { headers: { token } }
                );
                toast.success(response.data.message);
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            for (const size in cartItems[item]) {
                try {
                    if (cartItems[item][size] > 0) {
                        totalCount += cartItems[item][size];
                    }
                } catch (error) {}
            }
        }
        return totalCount;
    };

    const getWishlistCount = () => {
        let WishListCount = 0;
        for (const item in wishlistItems) {
            for (const size in wishlistItems[item]) {
                try {
                    if (wishlistItems[item][size] > 0) {
                        WishListCount += wishlistItems[item][size];
                    }
                } catch (error) {}
            }
        }
        return WishListCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    backendUrl + "/api/cart/update",
                    { itemId, size, quantity },
                    { headers: { token } }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };
    2;

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const quantity in cartItems[items]) {
                try {
                    if (cartItems[items][quantity] > 0) {
                        totalAmount +=
                            itemInfo.price * cartItems[items][quantity];
                    }
                } catch (error) {}
            }
        }
        return totalAmount;
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/product/list");
            console.log(response);
            if (response.status == 200) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message || "Error Loading Products");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(
                backendUrl + "/api/cart/get",
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    // Save to localStorage when cartItems changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Load from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        getWishlistCount,
        navigate,
        backendUrl,
        token,
        setToken,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
