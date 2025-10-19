import Buttons from "../miniComponents/Buttons";

export default function Pagination({ currentPage, totalPage, onPrev, onNext }) {
  return (
    <div>
      {/* <!-- start pagination  --> */}
      <div style={{ display: "flex", justifyContent: "center", padding: "15px" ,margin:"-25px 0 20px 0"}}>
        <div
          className="pagination"
          style={{ width: "23%", display: "flex", justifyContent: "center" }}
        >
          {/* زر السابق */}
          <Buttons
            text="Previous"
            style={{ fontSize: "11px" }}
            onClick={onPrev}
          />

          {/* النص */}
          <div
            className="flex"
            style={{ margin: "0 5px 0 5px", fontWeight: "600" }}
          >
            Page: <span style={{margin:"0 3px 0 3px"}}>{currentPage}</span> From: <span style={{margin:"0 3px 0 3px"}}>{totalPage}</span>
          </div>

          {/* زر التالي */}
          <Buttons
            text="Next"
            style={{ fontSize: "11px" }}
            onClick={onNext}
          />
        </div>
        {/* <!-- end pagination  -->  */}
      </div>
    </div>
  );
}