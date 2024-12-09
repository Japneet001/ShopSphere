import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Wishlist = () => {
    const { products, currency, wishlistItems, navigate, removeFromWishlist } =
        useContext(ShopContext);
    const [wishlistData, setWishlistData] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            const tempData = [];
            for (const items in wishlistItems) {
                for (const size in wishlistItems[items]) {
                    if (wishlistItems[items][size] > 0) {
                        tempData.push({
                            _id: items,
                            size: size,
                            quantity: wishlistItems[items][size],
                        });
                    }
                }
            }
            setWishlistData(tempData);
        }
    }, [wishlistItems, products]);

    return (
        <div className="border-t pt-14">
            <div className="text-2xl mb-3">
                <Title text1={"YOUR"} text2={"WISHLIST"} />
            </div>
            <div>
                {wishlistData.map((item, index) => {
                    const productData = products.find(
                        (product) => product._id === item._id
                    );
                    if (!productData) {
                        return null;
                    }
                    return (
                        <div
                            key={index}
                            className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr] sm:grid-cols-[4fr_0.5fr] items-center gap-4"
                        >
                            <div className="flex items-start gap-6">
                                <img
                                    className="w-16 sm:w-20"
                                    src={productData.image[0]}
                                />
                                <div>
                                    <p className="text-xs sm:text-lg font-medium">
                                        {productData.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        {productData.description}
                                    </p>
                                    <div className="flex items-center gap-5 mt-2">
                                        <p>
                                            {currency}
                                            {productData.price}
                                        </p>
                                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                                            {item.size}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* <input
                                onChange={(e) =>
                                    e.target.value === "" ||
                                    e.target.value === "0"
                                        ? null
                                        : updateQuantity(
                                              item._id,
                                              item.size,
                                              Number(e.target.value)
                                          )
                                }
                                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                                type="number"
                                min={1}
                                defaultValue={item.quantity}
                            /> */}
                            <img
                                onClick={() =>
                                    removeFromWishlist(item._id, item.size)
                                }
                                className="w-4 mr-4 sm:w-5 cursor-pointer"
                                src={assets.bin_icon}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end my-20">
                <button
                    onClick={() => navigate("/collection")}
                    className="bg-black text-white text-sm px-8 py-3 active:bg-gray-700"
                >
                    CONTINUE SHOPPING
                </button>
            </div>
        </div>
    );
};

export default Wishlist;
