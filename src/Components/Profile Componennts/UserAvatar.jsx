import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../miniComponents/LoadingSpinner";

const defaultAvatar =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function UserAvatar({ className }) {
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawAuth = localStorage.getItem("userAuth");
    if (!rawAuth) {
      setLoading(false);
      return;
    }

    const parsedAuth = JSON.parse(rawAuth);
    const userId = parsedAuth?.userData?.userId;

    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await axios.get(
          `http://localhost:5023/api/v1/users/id/${userId}`
        );
        setUserImage(res.data.imagePath);
      } catch (error) {
        console.error("Error fetching user image:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const style1 = !className
    ? {
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #024e96",
      }
    : {};

  if (loading) return <div><LoadingSpinner/></div>;

  return (
    <div>
      <img
        className={className}
        src={userImage || defaultAvatar}
        alt="User Avatar"
        style={style1}
      />
    </div>
  );
}
