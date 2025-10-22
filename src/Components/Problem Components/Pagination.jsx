import Buttons from "../miniComponents/Buttons";
import "./Pagination.css";

export default function Pagination({ currentPage, totalPage, onPrev, onNext }) {
  return (
    <div className="pagination-wrapper">
      <Buttons
        text="Previous"
        onClick={onPrev}
        className="pagination__button"
        style={{
          "--button-bg": "rgba(237, 244, 255, 0.9)",
          "--button-bg-hover": "rgba(226, 239, 255, 0.98)",
        }}
      />
      <div className="pagination__info">
        Page <span>{currentPage}</span> of <span>{totalPage}</span>
      </div>
      <Buttons
        text="Next"
        onClick={onNext}
        className="pagination__button"
        style={{
          "--button-bg": "rgba(237, 244, 255, 0.9)",
          "--button-bg-hover": "rgba(226, 239, 255, 0.98)",
        }}
      />
    </div>
  );
}
