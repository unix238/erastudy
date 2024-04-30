import React, { useEffect, useState } from "react";
import { PropertyCard } from "../../components/UI/PropertyCard/PropertyCard";
import { useSelector } from "react-redux";
import PropertyService from "../../service/PropertyService";
import cl from "../BuyHistory/BuyHistory.module.css";
import { Icon } from "../../components/UI/Icon/Icon.jsx";
import { Pagination } from "../../components/UI/Pagination/Pagination.jsx";
import { useTranslation } from "react-i18next";
export const AuctionsHistory = ({ activeTab, isCLoading }) => {
  const { t } = useTranslation();
  const { userData } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(isCLoading);
  const [items, setItems] = useState([]);
  const [isBuyHistoryEmpty, setIsBuyHistoryEmpty] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 6;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const loadData = async () => {
    setIsLoading(true);
    const buyHistory = await PropertyService.getBuyHistory(userData._id);
    const buyHistoryLength = buyHistory?.data?.auctions?.length;
    setItems(
      await Promise.all(
        buyHistory?.data?.auctions?.map(async (item) => {
          const res = await PropertyService.getProperty(item.property);
          return res.data;
        })
      )
    );
    setIsLoading(false);
    setIsBuyHistoryEmpty(buyHistoryLength === 0);
    setTotalPages(Math.ceil(buyHistoryLength / 6));
  };
  useEffect(() => {
    setIsLoading(isCLoading);
  }, [isCLoading]);

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, [page]);

  return (
    <div className={cl.wrapper}>
      {isBuyHistoryEmpty ? (
        <div className={cl.empty}>
          <div className={cl.emptyIcon}>
            <Icon name='empty' />
          </div>
          <div className={cl.emptyText}>{t("history.empty")}</div>
        </div>
      ) : (
        <div className={cl.items}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <PropertyCard
                className={cl.card}
                key={index}
                customWidth={275}
                timer={false}
              />
            ))
          ) : (
            <>
              {items?.map((item) => (
                <div className={cl.item}>
                  <PropertyCard
                    key={item._id}
                    customWidth={275}
                    className={cl.card}
                    timer={false}
                    item={item}
                  />
                </div>
              ))}
              <div className={cl.pagination}>
                <Pagination
                  totalPages={totalPages}
                  page={page}
                  setPage={setPage}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
