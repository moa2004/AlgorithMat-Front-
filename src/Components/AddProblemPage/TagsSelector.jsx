import { useEffect, useState } from "react";
import HelperText from "../miniComponents/HelperText";

export default function TagsSelector({ selected, onChange }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5023/api/v1/tags");
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data = await res.json();
        setTags(data);
      } catch (err) {
        console.error(err);
        setError("Tags not fetched.");
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
  <section className="tags-container">
    <h2>Select Tags</h2>
    <HelperText>
      Choose relevant tags to make the problem easier to find (e.g., math,
      arrays).
    </HelperText>

    {loading && (
      <p className="field-status field-status--info">Loading tags...</p>
    )}

    {error && <p className="field-status field-status--error">{error}</p>}

    {!loading && !error && (
      <div className="tags-list">
        {tags.map((tag) => (
          <button
            key={tag.tagID}
            onClick={() => toggleTag(tag.tagID)}
            className={`tag-button ${
              selected.includes(tag.tagID) ? "active" : ""
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    )}
  </section>
);
}