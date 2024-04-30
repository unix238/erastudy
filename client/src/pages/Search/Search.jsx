import React, { useEffect, useState } from "react";
import cl from "./Search.module.css";
import { useTranslation } from "react-i18next";
import { PropertyCard } from "../../components/UI/PropertyCard/PropertyCard.jsx";
import RangeSlider from "react-range-slider-input";
import { Breadcrumbs } from "../../components/UI/Breadcrumbs/Breadcrumbs.jsx";
import { Pagination } from "../../components/UI/Pagination/Pagination.jsx";
import { Advertisement } from "../../components/UI/Advertisement/Advertisement.jsx";
import { SelectionBlock } from "../../components/UI/SelectionBlock/SelectionBlock.jsx";
import { SelectionBox } from "../../components/UI/SelectionBox/SelectionBox.jsx";
import PropertyService from "../../service/PropertyService.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../../components/UI/Icon/Icon";
import validate from "../../utils/validate.js";
import { SortSelector } from "../../components/UI/SortSelector/SortSelector.jsx";
import { YMaps, Map, Placemark, Clusterer } from "@pbe/react-yandex-maps";
import { useSelector } from "react-redux";

export const Search = () => {
  const [filterModalMobileOpen, setFilterModalMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [location, setLocation] = useState(useLocation());
  const { t, i18n } = useTranslation();
  const [currentSort, setCurrentSort] = useState("priceAscending");
  const [isLoading, setIsLoading] = useState(true);
  const [minPriceAmount, setMinPriceAmount] = useState("0");
  const [maxPriceAmount, setMaxPriceAmount] = useState("99999999999");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(999999);
  const [numberOfProperties, setNumberOfProperties] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCity, setSelectedCity] = useState("");
  const settings = useSelector((state) => state.settings);
  const [cities, setCities] = useState([]);
  const [isPropertyTypeExpanded, setIsPropertyTypeExpanded] = useState(
    location.state?.directions?.length > 0
  );
  const [sortsModalMobileOpen, setSortsModalMobileOpen] = useState(false);
  const [filters, setFilters] = useState({
    directions: [],
    price: "",
    isCompleted: [],
    ...location.state,
  });
  const [properties, setProperties] = useState({
    directions: [
      {
        id: 1,
        text: "Книги",
        value: null,
        isChecked: false,
        name: "residentialProperty",
      },
      {
        id: 2,
        text: "Менторы",
        value: null,
        isChecked: false,
        name: "commercialProperty",
      },
      {
        id: 3,
        text: "Курсы",
        value: null,
        isChecked: false,
        name: "landPlot",
      },
    ],
  });
  const [filteredProperties, setFilteredProperties] = useState([]);

  const validatePrice = (price) => {
    return validate.price(price);
  };

  const options = [
    { value: "priceAscending", label: "Цена по возрастанию" },
    { value: "priceDescending", label: "Цена по убыванию" },
    { value: "roiAscending", label: "По возрастанию срока окупаемости" },
    { value: "roiDescending", label: "По убыванию срока окупаемости" },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChangeAmount = (values) => {
    setMinPriceAmount(values[0]);
    setMaxPriceAmount(values[1]);
  };

  const handleMinPriceAmount = (e) => {
    if (!validatePrice(e.target.value)) {
      return;
    }
    setMinPriceAmount(e.target.value);
  };

  const handleMaxPriceAmount = (e) => {
    if (!validatePrice(e.target.value)) {
      return;
    }
    setMaxPriceAmount(e.target.value);
  };

  const onSortChange = (e) => {
    setCurrentSort(e);
  };
  const isFilterEmpty = () => {
    return (
      filters?.directions?.length === 0 &&
      filters?.price === "" &&
      filters?.isCompleted?.length === 0
    );
  };

  const addFilter = (key, value) => {
    setFilters((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };
  

  const loadData = async () => {
    if (location.state) {
      addFilter(
        Object.keys(location.state)[0],
        Object.values(location.state)[0]
      );
      setLocation((prevState) => {
        return {
          ...prevState,
          state: null,
        };
      });
    }
    if (!isFilterEmpty()) {
      const req = await PropertyService.getFilteredProperties(
        filters,
        currentSort,
        page,
        12
      );
      console.log(filters);
      setFilteredProperties(req.data);
      setIsLoading(false);
      setTotalPages(Math.ceil(req.headers["x-total-count"] / 12));
      setNumberOfProperties(req.headers["x-total-count"]);
    } else {
      const req = await PropertyService.getAllProperties(page, 12, currentSort);
      setFilteredProperties(req.data);
      setTotalPages(Math.ceil(req.headers["x-total-count"] / 12));
      setNumberOfProperties(req.headers["x-total-count"]);
    }
    setIsLoading(false);
  };

  const loadCountProperties = async () => {
    setProperties((prevProperties) => ({
      ...prevProperties,
      directions: prevProperties.directions.map((type) => {
        if (type.text === location.state?.directions?.[0]) {
          return { ...type, isChecked: true };
        }
        return type;
      })
    }));
    const propertiesCount = await PropertyService.getCountProperties(filters);
    setProperties((prevProperties) => ({
      ...prevProperties,
      directions: [
        {
          ...prevProperties.directions[0],
          value: propertiesCount?.count.residentialProperty,
        },
        {
          ...prevProperties.directions[1],
          
          value: propertiesCount?.count.commercialProperty,
        },
        {
          ...prevProperties.directions[2],
          value: propertiesCount?.count.landProperty,
        },
      ]
    }));
  };


  useEffect(() => {
    loadCountProperties();
  }, [filters]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      addFilter("price", `${minPriceAmount * 1000} - ${maxPriceAmount * 1000}`);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [minPriceAmount, maxPriceAmount]);

  useEffect(() => {
    loadData();
  }, [filters, page, currentSort]);

  return (
    <div className={cl.root}>
      <header className={cl.header}>
        <div className='wrapper'>
          <Breadcrumbs path={["search"]} name={[`${t("path.search.title")}`]} />
          <div className={cl.top}>
            <div className={cl.found}>
              {t("search.found.1")} {numberOfProperties} {t("search.found.2")}
            </div>
            <div className={cl.mobileButtons}>
              <div
                className={cl.filterButton}
                onClick={() => setFilterModalMobileOpen(true)}
              >
                <Icon name='propertyActiveMobile' />
              </div>
              <div
                className={cl.filterButton}
                onClick={() => setSortsModalMobileOpen(true)}
              >
                <Icon name='sort-2' />
              </div>
            </div>
            <div className={cl.sort}>
              <SortSelector
                currentSort={currentSort}
                onSortChange={(e) => setCurrentSort(e)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className={cl.main}>
        <div className='wrapper'>
          <div className={cl.select}>
            <div className={`${cl.filters} ${cl.filterMain}`}>
              <SelectionBlock
                isChecked={true}
                title={t("search.filterTitle.1")}
              >
                {Object.values(properties.directions).map((item) => (
                  <SelectionBox
                    id={`directions-${item.id}`}
                    key={item.id}
                    title={item.text}
                    value={item.value}
                    isChecked={item.isChecked}
                    onCheckboxChange={(e) => {
                      setProperties((prevState) => ({
                        ...prevState,
                        directions: prevState.directions.map((type) => {
                          if (type.id === item.id) {
                            return { ...type, isChecked: e.target.checked };
                          }
                          return type;
                        }),
                      }));
                      if (e.target.checked) {
                        addFilter("directions", [
                          ...filters.directions,
                          item.text,
                        ]);
                      } else {
                        setFilters((prevState) => ({
                          ...prevState,
                          directions: prevState.directions.filter(
                            (type) => type !== item.text
                          ),
                        }));
                      }
                    }}
                  />
                ))}
              </SelectionBlock>
              <div className={cl.totalAmount}>
                <div className={cl.filterTitle}>
                  {t("search.filterTitle.3")}
                </div>
                <div className={cl.slider}>
                  <RangeSlider
                    min={minPrice}
                    max={maxPrice}
                    step={1000}
                    value={[minPriceAmount, maxPriceAmount]}
                    onInput={handlePriceChangeAmount}
                  />
                </div>
                <div className={cl.inputs}>
                  <div className={cl.inputTop}>
                    <div className={cl.inputTitle}>{t("search.from")}</div>
                    <div className={cl.inputTitle}>{t("search.to")}</div>
                  </div>
                  <div className={cl.inputBottom}>
                    <div className={cl.inputArea}>
                      <input
                        // placeholder='0'
                        className={cl.fontArea}
                        type='number'
                        value={minPriceAmount === "0" ? "" : minPriceAmount}
                        onChange={handleMinPriceAmount}
                        maxLength={13}
                      />
                      <div className={cl.k}>₸</div>
                    </div>
                    <div className={cl.inputArea}>
                      <input
                        // placeholder='999999'
                        className={cl.fontArea}
                        type='number'
                        value={
                          maxPriceAmount === "999999" ? "" : maxPriceAmount
                        }
                        onChange={handleMaxPriceAmount}
                        maxLength={13}
                      />
                      <div className={cl.k}>₸</div>
                    </div>
                  </div>
                </div>
              </div>

              <SelectionBlock title={t("search.filterTitle.7")} isChecked={true}>
                <YMaps>
                  <Map
                    onClick={(e) => {
                      navigate("/map");
                    }}
                    defaultState={{
                      center: [43.2363647, 76.9501065],
                      zoom: 10,
                    }}
                    className={cl.map}
                  ></Map>
                </YMaps>
              </SelectionBlock>

              <div className={cl.add}>
                <Advertisement
                  title={
                    settings.SearchPageBannerTextTitle
                      ? settings.SearchPageBannerTextTitle[
                          i18n.language == "en"
                            ? 0
                            : i18n.language == "ru"
                            ? 1
                            : 2
                        ]
                      : ""
                  }
                  subtitle={
                    settings.SearchPageBannerTextSubtitle
                      ? settings.SearchPageBannerTextSubtitle[
                          i18n.language == "en"
                            ? 0
                            : i18n.language == "ru"
                            ? 1
                            : 2
                        ]
                      : ""
                  }
                  link={settings?.SearchPageBannerLink}
                  image={
                    settings?.SearchPageBannerImage
                      ? settings.SearchPageBannerImage
                      : ""
                  }
                />
              </div>
            </div>
            <div className={cl.results}>
              {isLoading
                ? Array.from({ length: 12 }, (_, i) => i + 1).map(
                    (property) => (
                      <PropertyCard
                        key={property}
                        timer={false}
                        customWidth={275}
                        item={null}
                      />
                    )
                  )
                : filteredProperties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      timer={false}
                      // customWidth={275}
                      type={"search"}
                      item={property}
                      className={cl.cardStyle}
                    />
                  ))}
            </div>
          </div>
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        </div>
      </main>

      {filterModalMobileOpen && (
        <>
          <div className={cl.filterMobilePage}>
            <div className={cl.topMobile}>
              <div className={cl.topItem}>Фильтры</div>
              <div
                className={cl.topItem}
                onClick={() => setFilterModalMobileOpen(false)}
              >
                <Icon name='close' />
              </div>
            </div>
            <div className={cl.filters} id={"filters"}>
              <SelectionBlock
                isChecked={isPropertyTypeExpanded}
                title={t("search.filterTitle.1")}
              >
                {Object.values(properties.directions).map((item) => (
                  <SelectionBox
                    id={`directions-${item.id}`}
                    key={item.id}
                    title={item.text}
                    value={item.value}
                    isChecked={item.isChecked}
                    onCheckboxChange={(e) => {
                      setProperties((prevState) => ({
                        ...prevState,
                        directions: prevState.directions.map((type) => {
                          if (type.id === item.id) {
                            return { ...type, isChecked: e.target.checked };
                          }
                          return type;
                        }),
                      }));
                      if (e.target.checked) {
                        addFilter("directions", [
                          ...filters.directions,
                          item.text,
                        ]);
                      } else {
                        setFilters((prevState) => ({
                          ...prevState,
                          directions: prevState.directions.filter(
                            (type) => type !== item.text
                          ),
                        }));
                      }
                    }}
                  />
                ))}
              </SelectionBlock>
              <div className={cl.totalAmount}>
                <div className={cl.filterTitle}>
                  {t("search.filterTitle.3")}
                </div>
                <div className={cl.slider}>
                  <RangeSlider
                    min={minPrice}
                    max={maxPrice}
                    step={1000}
                    value={[minPriceAmount, maxPriceAmount]}
                    onInput={handlePriceChangeAmount}
                  />
                </div>
                <div className={cl.inputs}>
                  <div className={cl.inputTop}>
                    <div className={cl.inputTitle}>{t("search.from")}</div>
                    <div className={cl.inputTitle}>{t("search.to")}</div>
                  </div>
                  <div className={cl.inputBottom}>
                    <div className={cl.inputArea}>
                      <input
                        // placeholder='0'
                        className={cl.fontArea}
                        type='number'
                        value={minPriceAmount === "0" ? "" : minPriceAmount}
                        onChange={handleMinPriceAmount}
                        maxLength={13}
                      />
                      <div className={cl.k}>K</div>
                    </div>
                    <div className={cl.inputArea}>
                      <input
                        // placeholder='999999'
                        className={cl.fontArea}
                        type='number'
                        value={
                          maxPriceAmount === "999999" ? "" : maxPriceAmount
                        }
                        onChange={handleMaxPriceAmount}
                        maxLength={13}
                      />
                      <div className={cl.k}>K</div>
                    </div>
                  </div>
                </div>
              </div>

              <SelectionBlock title={t("search.filterTitle.4")}>
                <select
                  className={cl.selectCity}
                  value={selectedCity}
                  onChange={(e) => addFilter("city", e.target.value)}
                >
                  <option disabled={true} className={cl.optionCity} value=''>
                    {t("search.chooseCity")}
                  </option>
                  {cities.map((city) => (
                    <option
                      className={cl.optionCity}
                      key={city._id}
                      value={city._id}
                    >
                      {
                        city.title[
                          i18n.language == "en"
                            ? 0
                            : i18n.language == "ru"
                            ? 1
                            : 2
                        ]
                      }
                    </option>
                  ))}
                </select>
              </SelectionBlock>

              <div className={cl.add}>
                <Advertisement />
              </div>
            </div>
          </div>
        </>
      )}

      {sortsModalMobileOpen && (
        <>
          <div className={cl.filterMobilePage}>
            <div className={cl.topMobile}>
              <div className={cl.topItem}>Фильтры</div>
              <div
                className={cl.topItem}
                onClick={() => setSortsModalMobileOpen(false)}
              >
                <Icon name='close' />
              </div>
            </div>

            <div className={cl.sortSelector} onClick={() => setIsOpen(!isOpen)}>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`${cl.option} ${cl.sortOptionText} ${
                    option.value === currentSort ? cl.active : ""
                  } ${cl.blackText}`}
                  onClick={(e) => {
                    setSelectedOption(option);
                    onSortChange(option.value);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
