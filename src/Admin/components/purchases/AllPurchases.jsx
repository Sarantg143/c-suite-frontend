import React from "react";
import PurchaseList from "./PurchaseList";

const AllPurchases = () => {
  return (
    <div className="user-page">
      <>
        <h2 className="users-page-title">Purchases </h2>
        <p>Check all the Purchases </p>
      </>
      <div className="users-list-header">
        <h2>
          All Purchases
          <span> 44</span>
        </h2>
        {/* <div className="users-header-actions-cnt">
          <div className="search-user-cnt">
            <img src={searchIcon} alt="search-icon" className="search-icon" />
            <input type="text" className="search-input" placeholder="Search" />
          </div>
          <div className="add-new-btn" onClick={() => openNewUser()}>
            <img
              src={addIcon}
              alt="add-icon"
              className="search-icon add-icon"
            />
            <p> Add user</p>
          </div>
        </div> */}
      </div>
      <PurchaseList />
    </div>
  );
};

export default AllPurchases;
