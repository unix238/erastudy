import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cl from "./Navbar.module.css";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components/UI/Icon/Icon";
import { Button } from "../../components/UI/Button/Button";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Modal } from "../../components/UI/Modal/Modal.jsx";
import validate from "../../utils/validate.js";
import LotContactFormService from "../../service/LotContactFormService.js";
import PropertyService from "../../service/PropertyService";
import presentation from "../../assets/Камила Жантемир.pdf";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const changeLanguage = (lang) => {
    setIsLanguageModalOpen(!isLanguageModalOpen);
    i18n.changeLanguage(lang);
  };
  const logout = () => {
    Cookies.remove("token");
    window.location.reload();
  };

  const validateName = () => {
    if (name.length === 0) {
      setNameError(false);
      return false;
    }
    setNameError(!validate.name(name));
    return validate.name(name);
  };

  const validatePhone = () => {
    if (phone.length === 0) {
      setPhoneError(false);
      return false;
    }
    setPhoneError(!validate.phone(phone));
    return validate.phone(phone);
  };

  const validateComment = () => {
    if (comment.length === 0) {
      setCommentError(false);
      return false;
    }
    setCommentError(!validate.comment(comment));
    return validate.comment(comment);
  };

  const handleFieldsChange = (e) => {
    const filled = validateName() && validatePhone() && validateComment();
    setIsFieldsFilled(filled);
  };

  const handleContinueButton = async () => {
    console.log(name, phone, comment);
    const lot = await LotContactFormService.saveData(
      name,
      phone,
      comment
    );
    setIsLotModalOpen(false);
    setIsFilled(true);
    setName("");
    setPhone("");
    setComment("");
    alert("Ваша заявка принята");
  };

  const redirectToPofile = () => {
    if (user?.isAuth) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const validateModal = () => {
    if (user?.isAuth) {
      return;
    }
  };

  useEffect(() => {
    handleFieldsChange();
  }, [name, phone, comment]);

  return (
    <div className={cl.root}>
      <div className='wrapper'>
        <div className={cl.navbar}>
          <div className={cl.block}>
            <div className={cl.logoMAIN}>
              <Link to='/'>
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="73.000000pt" height="27.000000pt" viewBox="0 0 310.000000 214.000000"
                preserveAspectRatio="xMidYMid meet">

                  <g transform="translate(0.000000,214.000000) scale(0.140000,-0.0750000)"
                  fill="#161452" stroke="none">
                  <path d="M12 2128 c-17 -17 -17 -389 0 -406 9 -9 316 -12 1320 -12 l1309 0 24
                    -25 c24 -24 25 -28 25 -184 0 -155 -1 -161 -24 -188 l-24 -28 -1319 -5 -1318
                    -5 0 -205 0 -205 575 0 575 0 5 200 c3 110 8 193 12 185 4 -8 80 -256 168
                    -550 89 -294 172 -570 186 -612 l26 -78 384 0 384 0 2 422 3 423 190 0 190 0
                    3 -422 2 -423 190 0 190 0 -2 923 -3 922 -33 67 c-42 86 -98 143 -180 181
                    l-67 32 -1390 3 c-1084 2 -1393 0 -1403 -10z m1926 -1688 c1 -251 -1 -410 -7
                    -405 -14 15 -251 807 -245 817 3 5 60 7 127 6 l122 -3 3 -415z"/>
                    <path d="M11 416 c-8 -9 -11 -72 -9 -207 l3 -194 578 -3 577 -2 -2 207 -3 208
                      -566 3 c-473 2 -568 0 -578 -12z"/>
                    </g>
                  </svg>
              </Link>
            </div>
          </div>
          <div className={cl.center}>
            <div className={cl.item}>
              <Link to='/search' className={`${cl.link} headline`}>
                {t("navbar.link1")}
              </Link>
            </div>
            <div className={cl.item}>
              <Link to='/' className={`${cl.link} headline`}>
                {t("navbar.link2")}
              </Link>
            </div>
            <div className={cl.item}>
              <Link
                to='/'
                // to={presentation}
                // download={presentation}
                // target='_blank'
                className={`${cl.link} headline`}
              >
                {t("navbar.link3")}
              </Link>
            </div>
            <div className={cl.item}>
              <Link to='/' className={`${cl.link} headline`}>
                {t("navbar.link4")}
              </Link>
            </div>
          </div>

          <div className={cl.rightBlock}>
            <Button
              className={cl.lot}
              onClick={() => {
                setIsLotModalOpen(!isLotModalOpen);
                setIsProfileModalOpen(false);
                setIsLanguageModalOpen(false);
              }}
            >
              <div className={cl.lotText}>{t("navbar.lot.text")}</div>
            </Button>

            <div className={cl.block}>
              <div
                className={cl.language}
                onClick={() => {
                  setIsLotModalOpen(false);
                  setIsProfileModalOpen(false);
                  setIsLanguageModalOpen(!isLanguageModalOpen);
                }}
              >
                <div className={cl.icon}>
                  <Icon name='language' />
                </div>
                {isLanguageModalOpen && (
                  <div className={`${cl.menu} ${cl.lngmenu}`}>
                    <div
                      onClick={() => {
                        changeLanguage("en");
                      }}
                      className={cl.menu__item}
                    >
                      English
                    </div>
                    <div
                      onClick={() => {
                        changeLanguage("kz");
                      }}
                      className={cl.menu__item}
                    >
                      Қазақша
                    </div>
                    <div
                      onClick={() => {
                        changeLanguage("ru");
                      }}
                      className={cl.menu__item}
                    >
                      Русский
                    </div>
                  </div>
                )}

                <div className={cl.language__text}>{t("navbar.language")}</div>
              </div>

              {!user?.isAuth ? (
                <div
                  className={cl.iconLogin}
                  onClick={() => navigate("/login")}
                >
                  <div className={cl.iconL}>
                    <Icon name='login' />
                  </div>
                  <div className='h6'>{t("navbar.login")}</div>
                </div>
              ) : (
                <div className={cl.profile}>
                  {user?.userData?.name ? (
                    <div
                      onClick={() => {
                        setIsLotModalOpen(false);
                        setIsProfileModalOpen(!isProfileModalOpen);
                        setIsLanguageModalOpen(false);
                      }}
                      className={cl.badge}
                    >
                      {user?.userData?.name[0]}
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setIsLotModalOpen(false);
                        setIsProfileModalOpen(!isProfileModalOpen);
                        setIsLanguageModalOpen(false);
                      }}
                      className={cl.badge}
                    >
                      {user?.userData?.email[0]}
                    </div>
                  )}
                  {isProfileModalOpen && (
                    <div className={cl.menu}>
                      <div
                        to='/profile'
                        onClick={() => {
                          setIsProfileModalOpen(false);
                          navigate("/profile");
                        }}
                        className={cl.menu__item}
                      >
                        {t("navbar.myProfile")}
                      </div>
                      <div
                        to='/profile'
                        onClick={() => {
                          setIsProfileModalOpen(false);
                          navigate("/profile");
                        }}
                        className={cl.menu__item}
                      >
                        {t("navbar.favorite")}
                      </div>
                      <div
                        to='/profile'
                        onClick={() => {
                          setIsProfileModalOpen(false);
                          navigate("/profile", { state: { url: "history" } });
                        }}
                        className={cl.menu__item}
                      >
                        {t("navbar.buyHistory")}
                      </div>
                      <div onClick={() => logout()} className={cl.menu__item}>
                        {t("navbar.logout")}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLotModalOpen && (
        <Modal
          onClick={() => setIsLotModalOpen(false)}
          style={{ display: "block" }}
        >
          <div className='modalWrapper' onClick={(e) => e.stopPropagation()}>
            <div className={cl.lotTop}>
              {/* <div className={cl.lotTitle}>{t("navbar.lot.title")}</div> */}
              <div
                className={cl.modalClose}
                onClick={() => setIsLotModalOpen(false)}
              >
                <Icon name='close' />
              </div>
            </div>

            <div className={cl.lotWrapper}>
              <div className={cl.lotMain}>
                <div className={cl.fillForm}>
                  <div className={cl.lotFillText}>
                    {t("navbar.lot.fillText")}
                  </div>
                  <div className={cl.lotBlocks}>
                    <div className={cl.lotBlock}>
                    </div>
                    {!user?.isAuth && (
                      <>
                        <div className={cl.lotBlock}>
                          <div className={cl.lotBlockTitle}>
                            {t("navbar.lot.name.title")}
                          </div>
                          <input
                            type='text'
                            className={`${cl.lotBlockInput} ${
                              nameError && cl.lotBlockInputError
                            }`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t("navbar.lot.name.placeholder")}
                          />
                          {nameError && (
                            <div className={cl.error}>
                              {t("navbar.lot.name.error")}
                            </div>
                          )}
                        </div>
                        <div className={cl.lotBlock}>
                          <div className={cl.lotBlockTitle}>
                            {t("navbar.lot.phone.title")}
                          </div>
                          <input
                            type='text'
                            className={`${cl.lotBlockInput} ${
                              phoneError && cl.lotBlockInputError
                            }`}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t("navbar.lot.phone.placeholder")}
                          />
                          {phoneError && (
                            <div className={cl.error}>
                              {t("navbar.lot.phone.error")}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    <div className={cl.lotBlock}>
                      <div className={cl.lotBlockTitle}>
                        {t("navbar.lot.comment.title")}
                      </div>
                      <input
                        type='text'
                        className={`${cl.lotBlockInput} ${
                          commentError && cl.lotBlockInputError
                        }`}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t("navbar.lot.comment.placeholder")}
                      />
                      {commentError && (
                        <div className={cl.error}>
                          {t("navbar.lot.comment.error")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  className={`${cl.lotContinue} ${
                    !isFieldsFilled && cl.lotContinueDisabled
                  }`}
                  style={{ height: "44px" }}
                  onClick={handleContinueButton}
                >
                  {t("navbar.lot.continue")}
                </Button>
                <div className={cl.lotOR}>
                  <div className={cl.lotORLine} />
                  <div className={cl.lotORText}>{t("navbar.lot.or")}</div>
                  <div className={cl.lotORLine} />
                </div>
                <Button
                  className={cl.lotTelegram}
                  onClick={() => {
                    setIsLotModalOpen(false);
                    window.open("https://t.me/inlotKzBot");
                  }}
                >
                  <div className={cl.lotTelegramIcon}>
                    <Icon name='telegram' />
                  </div>
                  <div className={cl.lotTelegramText}>
                    {t("navbar.lot.telegram")}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {isFilled && (
        <Modal>
          <div className={cl.filled}>
            <div className={cl.lotTitle}>{t("navbar.lot.filled.title")}</div>
            <div className={cl.filledMain}>
              <div className={cl.filledIcon}>
                <Icon name='twoChat' />
              </div>
              <div className={cl.filledText}>
                <div className={cl.filledText1}>
                  {t("navbar.lot.filled.text")}
                </div>
                <div className={cl.filledText2}>
                  15 {t("navbar.lot.filled.time")}
                </div>
              </div>
            </div>
            <div className={cl.filledButton}>
              <Button
                className={cl.lotContinue}
                onClick={() => setIsFilled(false)}
                style={{ height: "44px" }}
              >
                {t("navbar.lot.filled.button")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className={cl.mobile}>
        <div className={`${cl.mobileNavbar} wrapper`}>
          <div className='mobileIcon' onClick={() => setIsMobileMenuOpen(true)}>
            <Icon name={"hamburger"} />
          </div>
          <div className='mobileIcon'>
            <a href='/'>
              <Icon name={"logoSVG"} />
            </a>
          </div>
          <div className='mobileIcon' onClick={redirectToPofile}>
            <Icon name={"navUser"} />
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className={cl.hambeurgerMenu}>
          <div className={cl.topContent}>
            <div className={cl.hTop}>
              <div className='hleft'>
                <Icon name={"logoSVG"} />
              </div>
              <div
                className='hright'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name={"close"} />
              </div>
            </div>
            <div className={`${cl.hlinks}`}>
              <a className={cl.hlink} href='/'>
                {t("navbar.link1")}
              </a>
              <a className={cl.hlink} href='/'>
                {t("navbar.link2")}
              </a>
              <a className={cl.hlink} href='/'>
                {t("navbar.link3")}
              </a>
              <a className={cl.hlink} href='/'>
                {t("navbar.link4")}
              </a>
              <a className={cl.hlink} href='/'>
                {t("navbar.myProfile")}
              </a>
            </div>
            <Button
              className={cl.lot}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLotModalOpen(true);
                setIsProfileModalOpen(false);
                setIsLanguageModalOpen(false);
              }}
            >
              <div className={cl.lotText}>{t("navbar.lot.text")}</div>
            </Button>
          </div>
          <div className={cl.bottomContent}>
            <div
              className={cl.language}
              onClick={() => {
                setIsLotModalOpen(false);
                setIsProfileModalOpen(false);
                setIsLanguageModalOpen(!isLanguageModalOpen);
              }}
            >
              <div className={cl.icon}>
                <Icon name='language' />
              </div>
              {isLanguageModalOpen && (
                <div className={`${cl.menu} ${cl.lngmenu}`}>
                  <div
                    onClick={() => {
                      changeLanguage("en");
                    }}
                    className={cl.menu__item}
                  >
                    English
                  </div>
                  <div
                    onClick={() => {
                      changeLanguage("kz");
                    }}
                    className={cl.menu__item}
                  >
                    Қазақша
                  </div>
                  <div
                    onClick={() => {
                      changeLanguage("ru");
                    }}
                    className={cl.menu__item}
                  >
                    Русский
                  </div>
                </div>
              )}

              <div className={cl.language__text}>{t("navbar.language")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
