import { useEffect, useState } from "react";
import HelperText from "../miniComponents/HelperText";

export default function TagsSelector({ selected, onChange }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // للتعامل مع الأخطاء

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5023/api/v1/tags"
        );
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data = await res.json();
        setTags(data);
      } catch (err) {
        console.error(err);
        setError("Tags not fetched ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((t) => t !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="tags-container">
      <h2 style={{ marginBottom: "10px" }}>Select Tags</h2>
      <HelperText>
        Choose relevant tags to make the problem easier to find (e.g., math,
        arrays).
      </HelperText>

      {/* حالة التحميل */}
      {loading && <p style={{ color: "#007bff" }}> Loading tags...⏳</p>}

      {/* حالة الخطأ */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* عرض التاغات بعد التحميل */}
      {!loading &&
        !error &&
        tags.map((tag) => (
          <button
            key={tag.tagID}
            onClick={() => toggleTag(tag.tagID)}
            className={
              selected.includes(tag.tagID) ? "tag-button active" : "tag-button"
            }
          >
            {tag.name}
          </button>
        ))}
    </div>
  );
}
