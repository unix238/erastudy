import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTimer } from "react-timer-hook";

import PropertyService from "../../service/PropertyService";
import cl from "./Property.module.css";

import Skeleton from "react-loading-skeleton";
import { ImageGallery } from "../../modules/ImageGallery/ImageGallery";
import { maskToPrice } from "../../utils/mask";
import { Button } from "../../components/UI/Button/Button";
import { Icon } from "../../components/UI/Icon/Icon.jsx";
import { Advertisement } from "../../components/UI/Advertisement/Advertisement.jsx";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { QuestionBlock } from "../../components/UI/QuestionBlock/QuestionBlock.jsx";
import { Tooltip } from "../../components/UI/Tooltip/Tooltip.jsx";
import { Breadcrumbs } from "../../components/UI/Breadcrumbs/Breadcrumbs.jsx";

export const Property = () => {
  const { t, i18n } = useTranslation();
  const user = useSelector((state) => state.auth);
  const [property, setProperty] = useState(null);
  const [developer, setDeveloper] = useState(null);
  const [activeButton, setActiveButton] = useState(0);
  const [isDealPurchased, setIsDealPurchased] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const navigate = useNavigate();
  const settings = useSelector((state) => state.settings);

  const { days, minutes, hours, restart } = useTimer({});

  const [data, setData] = useState([
    { name: "Перепродажа", value: true },
    { name: "Сдача в аренду", value: true },
    { name: "Флиппинг", value: false },
  ]);
  const [descriptions, setDescriptions] = useState([]);
  const [defaultState, setDefaultState] = useState(null);

  const [resaleDescription, setResaleDescription] = useState([
    {
      title: ["Price after 12 months", "Цена через 12 мес", "kz pa12m"],
      key: "priceOverTime",
      value: null,
    },
    { title: ["ROI", "ROI", "ROI"], key: "roi", value: null },
    {
      title: ["Coefficient of liquidity", "Коэффициент ликвидности", "kz"],
      key: "liquidity",
      value: null,
    },
  ]);
  const [rentalDescription, setRentalDescription] = useState([
    { title: ["price", "Цена", "kz"], key: "price", value: null },
    {
      title: ["repair price", "Стоимость ремонта", "kz"],
      key: "repairCost",
      value: null,
    },
    { title: ["sale", "Продажа", "kz"], key: "sale", value: null },
  ]);
  const [flippingDescription, setFlippingDescription] = useState([
    { title: ["price", "Цена", "kz"], key: "price", value: null },
    {
      title: ["price", "Стоимость ремонта", "kz"],
      key: "repairCost",
      value: null,
    },
    { title: ["sale", "Продажа", "kz"], key: "sale", value: null },
  ]);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(
    Array.from({ length: 5 }, () => false)
  );

  const { id } = useParams();

  const optionsInfoArray = data.filter((item) => item?.value);
  const optionsArray = optionsInfoArray.map((optionInfo, index) => {
    const isSingleOption = optionsInfoArray.length === 1;

    if (isSingleOption)
      return (
        <div key={index} className={`${cl.option} ${cl.singleOption}`}>
          <div className={`${cl.text} ${cl.singleText}`}>
            {optionInfo.name == "resale"
              ? i18n.language == "en"
                ? "Resale"
                : i18n.language == "ru"
                ? "Перепродажа"
                : "Resale"
              : ""}
            {optionInfo.name == "rental"
              ? i18n.language == "en"
                ? "Rent"
                : i18n.language == "ru"
                ? "Аренда"
                : "Rent"
              : ""}
            {optionInfo.name == "flipping"
              ? i18n.language == "en"
                ? "Flipping"
                : i18n.language == "ru"
                ? "Флиппинг"
                : "Flipping"
              : ""}
          </div>
        </div>
      );

    return (
      <div
        key={index}
        className={`${cl.option} ${
          activeButton === optionInfo.name ? cl.active : cl.notActive
        }`}
        onClick={() => handleButtonClick(optionInfo.name)}
      >
        <div className={cl.text}>
          {optionInfo.name == "resale"
            ? i18n.language == "en"
              ? "Resale"
              : i18n.language == "ru"
              ? "Перепродажа"
              : "Resale"
            : ""}
          {optionInfo.name == "rental"
            ? i18n.language == "en"
              ? "Rent"
              : i18n.language == "ru"
              ? "Аренда"
              : "Rent"
            : ""}
          {optionInfo.name == "flipping"
            ? i18n.language == "en"
              ? "Flipping"
              : i18n.language == "ru"
              ? "Флиппинг"
              : "Flipping"
            : ""}
        </div>
      </div>
    );
  });

  const descriptionsArray = descriptions.map((descriptionInfo, index) => (
    <div key={index} className={cl.descriptionItem}>
      <div className={cl.top}>
        <div className={cl.title}>
          {
            descriptionInfo.title[
              i18n.language == "en" ? 0 : i18n.language == "ru" ? 1 : 2
            ]
          }
        </div>
        <div className={cl.infoIcon}>
          <Tooltip />
        </div>
      </div>
      <div className={cl.descText}>
        {
          descriptionInfo.value[
            i18n.language == "en" ? 0 : i18n.language == "ru" ? 1 : 2
          ]
        }
      </div>
    </div>
  ));

  const handleDescriptionClick = (index) => {
    setIsDescriptionExpanded((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  const handleReserveButtonClick = () => {
    if (
      user.userData?.iin === undefined ||
      user.userData?.address === undefined ||
      user.userData?.numberOfDocument === undefined
    ) {
      return navigate(`/editProfile/${property?._id}`);
    }
    navigate(`/payment/${property?._id}`);
  };

  const favoriteHandler = async () => {
    if (!user || !user?.isAuth) {
      return navigate("/login");
    }

    if (user?.userData?.favorites?.items?.includes(id)) {
      await PropertyService.removeFavorite(id);
    } else {
      await PropertyService.addFavorite(id);
    }
    window.location.reload();
  };

  const loadData = async () => {
    const property = await PropertyService.getProperty(id).then(async (res) => {
      setDefaultState({
        center: [res?.data?.coords.lat, res?.data?.coords.lng],
        zoom: 12,
      });
      const developer = await PropertyService.getDeveloper(
        res?.data?.developer
      );
      setData(
        Object.keys(res?.data?.buyOptions).map((key) => {
          return { name: key, value: res?.data?.buyOptions[key] };
        })
      );
      if (res?.data?.buyOptions?.resale) {
        setResaleDescription([
          {
            title: ["Price after 12 months", "Цена через 12 мес", "kz pa12m"],
            key: "priceOverTime",
            value: res?.data?.info.priceOverTime,
          },
          {
            title: ["ROI", "ROI", "ROI"],
            key: "roi",
            value: res?.data?.info.roi,
          },
          {
            title: [
              "Coefficient of liquidity",
              "Коэффициент ликвидности",
              "kz",
            ],
            key: "liquidity",
            value: res?.data?.info.liquidity,
          },
        ]);
      }
      if (res?.data?.buyOptions?.rental) {
        setRentalDescription([
          {
            title: ["price", "Цена", "kz"],
            value: res?.data?.info.rentalRate,
          },
          {
            title: ["ROI", "ROI", "ROI"],
            key: "roi",
            value: res?.data?.info.roi,
          },
          {
            title: [
              "Coefficient of liquidity",
              "Коэффициент ликвидности",
              "kz",
            ],
            key: "liquidity",
            value: res?.data?.info.liquidity,
          },
        ]);
      }
      if (res?.data?.buyOptions?.flipping) {
        setFlippingDescription([
          {
            title: ["price", "Цена", "kz"],
            key: "price",
            value: res?.data?.info.price,
          },
          {
            title: ["price", "Стоимость ремонта", "kz"],
            key: "repairCost",
            value: res?.data?.info.repairCost,
          },
          {
            title: ["sale", "Продажа", "kz"],
            key: "sale",
            value: res?.data?.info.sale,
          },
        ]);
      }
      setDeveloper(developer.data);
      Array.from(Object.keys(res?.data?.buyOptions)).map((key) => {
        if (res?.data?.buyOptions[key] && !activeButton) {
          setActiveButton(key);
        }
      });
      return res;
    });

    setProperty(property.data);
    const propertyData = [
      property?.data?.building,
      property?.data?.description,
      property?.data?.dealOverview,
      property?.data?.dealProfitability,
      property?.data?.dealCapitalIncrease,
    ];

    setQuestionData((prevData) => [...prevData, ...propertyData]);
  };
  const handleOrderButtonClick = () => {
    setIsDealPurchased(true);
  };

  const handleDescriptions = () => {
    if (activeButton == "rental") {
      setDescriptions(rentalDescription);
      return;
    }
    if (activeButton == "resale") {
      setDescriptions(resaleDescription);
      return;
    }
    if (activeButton == "flipping") {
      setDescriptions(flippingDescription);
      return;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    handleDescriptions();
  }, [activeButton]);

  useEffect(() => {
    if (property && property.timer) {
      restart(new Date(property.timer), true);
    }
    console.log(property);
    console.log(questionData);
  }, [property]);

  return (
    <div className='wrapper'>
      <Breadcrumbs
        path={["property"]}
        name={[
          property?.title[
            i18n.language == "en" ? 0 : i18n.language == "ru" ? 1 : 2
          ],
        ]}
      />
      <ImageGallery images={property?.images} id={id} video={property?.video} />
      <div className={cl.pageContent}>
        <div className={cl.pageLeft}>
          {property?.saleType === "auccion" && (
            <div className={`${cl.card} ${cl.cardAuction}`}>
              <div className={cl.timerLeftCard}>
                {t("property.timeLeftCard")}
              </div>
              <div className={cl.timer}>
                <div className={cl.icon}>
                  <Icon name='timer' />
                </div>
                <div className={cl.time}>
                  <div className={cl.blockTimer}>
                    <div className={cl.top}>
                      {days > 9 ? (
                        <>
                          <div className={cl.digit}>
                            {days.toString().split("")[0]}
                          </div>
                          <div className={cl.digit}>
                            {days.toString().split("")[1]}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={cl.digit}>0</div>
                          <div className={cl.digit}>{days}</div>
                        </>
                      )}
                    </div>
                    <div className={cl.bottom}>{t("propertyCard.days")}</div>
                  </div>
                  <svg
                    width='3'
                    height='10'
                    viewBox='0 0 3 10'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <circle cx='1.5' cy='1.5' r='1.5' fill='#CBD6FA' />
                    <circle cx='1.5' cy='8.5' r='1.5' fill='#CBD6FA' />
                  </svg>

                  <div className={cl.blockTimer}>
                    <div className={cl.top}>
                      {hours > 9 ? (
                        <>
                          <div className={cl.digit}>
                            {hours.toString().split("")[0]}
                          </div>
                          <div className={cl.digit}>
                            {hours.toString().split("")[1]}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={cl.digit}>0</div>
                          <div className={cl.digit}>{hours}</div>
                        </>
                      )}
                    </div>
                    <div className={cl.bottom}>{t("propertyCard.hour")}</div>
                  </div>
                  <svg
                    width='3'
                    height='10'
                    viewBox='0 0 3 10'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <circle cx='1.5' cy='1.5' r='1.5' fill='#CBD6FA' />
                    <circle cx='1.5' cy='8.5' r='1.5' fill='#CBD6FA' />
                  </svg>

                  <div className={cl.blockTimer}>
                    <div className={cl.top}>
                      {minutes > 9 ? (
                        <>
                          <div className={cl.digit}>
                            {minutes.toString().split("")[0]}
                          </div>
                          <div className={cl.digit}>
                            {minutes.toString().split("")[1]}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={cl.digit}>0</div>
                          <div className={cl.digit}>{minutes}</div>
                        </>
                      )}
                    </div>
                    <div className={cl.bottom}>{t("propertyCard.min")}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={cl.card}>
            <div className={cl.leftSide}>
              <div className={cl.cardTitle}>
                {property ? (
                  property.title[
                    i18n.language == "en" ? 0 : i18n.language == "ru" ? 1 : 2
                  ]
                ) : (
                  <Skeleton width={200} />
                )}
              </div>
              <div className={cl.subtitle}>
                <div className={cl.subtitleLeft}>
                  <div className={cl.type}>{t("property.type")}</div>
                  <div className={cl.valueLeft}>
                    {t("property.residential")}
                  </div>
                </div>
                <div className={cl.subtitleRight}>
                  <div className={cl.type}>{t("property.cost")}</div>
                  <div className={cl.valueRight}>
                    {property ? (
                      `${maskToPrice(property.price)}`
                    ) : (
                      <Skeleton width={150} />
                    )}
                  </div>
                </div>
              </div>
              <div className={cl.emblem}>
                <div className={cl.emblemIcon}>
                  <Icon name='emblem' />
                </div>
                <div className={cl.emblemText}>
                  {developer ? (
                    developer.title[
                      i18n.language == "en" ? 0 : i18n.language == "ru" ? 1 : 2
                    ]
                  ) : (
                    <Skeleton width={100} />
                  )}
                </div>
              </div>
            </div>
            <div className={cl.rightSide}>
              <div className={cl.favorite} onClick={favoriteHandler}>
                <div className={cl.favIcon}>
                  {user?.userData?.favorites?.items?.includes(id) ? (
                    <Icon name={"favoriteFilled"} />
                  ) : (
                    <Icon name={"favorite"} />
                  )}
                </div>
                <div className={cl.favText}>
                  {user?.userData?.favorites?.items?.includes(id) ? (
                    <>{t("property.saved")}</>
                  ) : (
                    <>{t("property.favorite")}</>
                  )}
                </div>
              </div>
              <Button
                className={cl.button}
                onClick={handleReserveButtonClick}
                type='fill'
              >
                {property?.saleType === "auccion"
                  ? t("property.reserveAuccion")
                  : t("property.reserve")}
              </Button>
            </div>
          </div>
          <div className={cl.secondCard}>
            <div className={cl.options}>
              <div className={cl.optionContainer}>{optionsArray}</div>
            </div>
            <div className={cl.description}>
              <div className={cl.descriptionContainer}>{descriptionsArray}</div>
              <div className={cl.descriptionAd}>
                <div className={cl.adLeft}>
                  <div className={cl.adText}>
                    {isDealPurchased
                      ? `${t("property.deal1.purchased")}`
                      : `${t("property.deal1.notPurchased")}`}
                  </div>
                </div>
                <div className={cl.adRight}>
                  <div
                    className={`${cl.adButton} ${
                      isDealPurchased
                        ? cl.adButtonPurchased
                        : cl.adButtonNotPurchased
                    }`}
                    onClick={() =>
                      navigate(`/payment/${property?._id}`, {
                        state: { file: true },
                      })
                    }
                  >
                    <div className={cl.adButtonText}>
                      {isDealPurchased
                        ? `${t("property.deal2.purchased")}`
                        : `${t("property.deal2.notPurchased")}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={cl.aboutDev}>
              <div className={cl.aboutDevTop}>
                <div className={cl.buildingIcon}>
                  <Icon name='building' />
                </div>
                <div className={cl.aboutDevTitle}>{t("property.aboutDev")}</div>
              </div>
              <div className={cl.aboutDevText}>
                <div className={cl.rank}>
                  <div className={cl.rankTitle}>{t("property.rank")}</div>
                  <div className={cl.rankValue}>
                    {developer ? developer.rating : <Skeleton width={100} />}
                  </div>
                </div>
                <div className={cl.solvency}>
                  <div className={cl.solvencyTitle}>
                    {t("property.solvency")}
                  </div>
                  <div className={cl.solvencyValue}>
                    {developer ? (
                      developer.financialStability
                    ) : (
                      <Skeleton width={100} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={cl.QuestionBlocks}>
              {questionData.map((question, index) => (
                <QuestionBlock
                  key={index}
                  title={t(`property.description.${index + 1}.title`)}
                  content={
                    question[
                      i18n.language == "en" ? 0 : i18n.language == "ru" ? 1 : 2
                    ]
                  }
                  count={index + 1}
                  border={cl.border}
                  active={cl.activeQuestionBlock}
                  flatIcon={false}
                  answer={cl.content}
                  lastBlock={index === 5 && true}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={cl.pageRight}>
          <div className={cl.map}>
            <div className={cl.mapContainer}>
              <div>
                <YMaps>
                  <Map defaultState={defaultState} className={cl.mapImage}>
                    <Placemark geometry={defaultState?.center} />
                  </Map>
                </YMaps>
              </div>
            </div>
            <div className={cl.mapRight}>
              <div className={cl.landmark}>
                <div className={cl.landmarkTitle}>{t("property.landMark")}</div>
                {property?.map?.near?.map((near) => (
                  <div
                    className={cl.landmarkItem}
                    key={`${Math.random() * 1000} dsada`}
                  >
                    <div className={cl.landmarkText}>
                      {
                        near?.title[
                          i18n.language == "en"
                            ? 0
                            : i18n.language == "ru"
                            ? 1
                            : 2
                        ]
                      }
                    </div>
                    <div className={cl.landmarkDistance}>
                      {
                        near?.distance[
                          i18n.language == "en"
                            ? 0
                            : i18n.language == "ru"
                            ? 1
                            : 2
                        ]
                      }
                    </div>
                  </div>
                ))}
              </div>
              <div className={cl.viewAll}>
                <div
                  className={cl.viewAllText}
                  onClick={() => navigate("/map", { state: property?._id })}
                >
                  {t("property.viewAll")}
                </div>
              </div>
            </div>
          </div>
          <Advertisement
            title={
              settings.propertyPageBannerText
                ? settings.propertyPageBannerText[
                    i18n.language == "en" ? 0 : i18n.language == "ru" ? 1 : 2
                  ]
                : ""
            }
            subtitle={
              settings.propertyPageBannerText
                ? settings.propertyPageBannerTextSubtitle[
                    i18n.language == "en" ? 0 : i18n.language == "ru" ? 1 : 2
                  ]
                : ""
            }
            link={
              settings.propertyPageBannerLink
                ? settings.propertyPageBannerLink
                : ""
            }
            image={
              settings?.propertyPageBannerImage
                ? settings?.propertyPageBannerImage
                : ""
            }
          />
          <div className={cl.checkList}>
            {Array.from({ length: 3 }, (_, i) => i + 1).map((index) => (
              <div
                className={cl.checkListItem}
                key={`${Math.random() * 1000} zcxzcz`}
              >
                <div className={cl.checkListIcon}>
                  <Icon name={`${t(`property.checkList.${index}.icon`)}`} />
                </div>
                <div className={cl.checkListRight}>
                  <div className={cl.checkListTitle}>
                    {t(`property.checkList.${index}.title`)}
                  </div>
                  <div className={cl.checkListText}>
                    <div className={cl.checkListWord}>
                      {t(`property.checkList.${index}.text`)}
                    </div>
                    <div className={cl.checkListDetails}>
                      {t("property.details")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
