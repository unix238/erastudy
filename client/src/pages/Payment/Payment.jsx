import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PropertyController from "../../service/PropertyService";
import cl from "./Payment.module.css";
import img from "../../assets/images/payment.png";
import { Breadcrumbs } from "../../components/UI/Breadcrumbs/Breadcrumbs";
import { Button } from "../../components/UI/Button/Button";
import { PaymentType } from "../../modules/PaymentType/PaymentType";
import { PaymentMethod } from "../../modules/PaymentOption/PaymentMethod";
import { useTranslation } from "react-i18next";
import { Modal } from "../../components/UI/Modal/Modal";
import { Icon } from "../../components/UI/Icon/Icon";

export const Payment = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [property, setProperty] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const [name, setName] = useState("");
  const [isFile, setIsFile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const contactHandler = async () => {
    const req = await PropertyController.cotact(id);
    navigate("/");
  };
  const loadData = async () => {
    if (location?.state?.file === true) {
      setIsFile(true);
    }
    if (!id) return;
    const data = await PropertyController.getProperty(id);
    setProperty(data);
    setName(
      data?.data?.title[
        i18n.language == "en" ? 0 : i18n.language == "ru" ? 1 : 2
      ]
    );
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (selectedType === "contact") {
      setCurrentStep(0);
      setShowModal(true);
      return;
    }
    if (selectedType) {
      setCurrentStep(1);
    }
  }, [selectedType]);

  return (
    <div className={cl.root}>
      <div className={`${cl.side} ${cl.left}`}>
        <Breadcrumbs
          path={[`property/${id}`, `payment/${id}`]}
          name={[`${name}`, `${t(`path.payment.title`)}`]}
        />
        {currentStep === 0 && (
          <PaymentType
            id={id}
            setSelectedType={setSelectedType}
            isFile={isFile}
          />
        )}
        {currentStep === 1 && (
          <PaymentMethod
            id={id}
            setCurrentStep={setCurrentStep}
            selectedType={selectedType}
            isFile={isFile}
          />
        )}
        {showModal && (
          <Modal>
            <div className={cl.modalView}>
              <div className={cl.modalTitle}>{t("payment.connect")}</div>
              <Icon name='contact' />
              <div className={cl.modalSubtitle}>
                {t("payment.contact")} 15 {t("payment.minute")}
              </div>
              <Button onClick={contactHandler} className={cl.btnModal}>
                {t("payment.main")}
              </Button>
            </div>
          </Modal>
        )}
      </div>
      <div className={cl.side}>
        <img src={img} className={cl.img} />
      </div>
    </div>
  );
};
