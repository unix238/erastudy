import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropertyService from "../../service/PropertyService";
import cl from "./Gallery.module.css";
import { Icon } from "../../components/UI/Icon/Icon";
import { useTranslation } from "react-i18next";
export const Gallery = () => {
  const { t } = useTranslation();
  const [property, setProperty] = useState(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const loadData = async () => {
    const res = await PropertyService.getProperty(id);
    if (res) {
      setProperty(res.data);
      return;
    }
    setIsError(true);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedImage === 0) {
      setSelectedImage(property?.images.length - 1);
      return;
    }
    setSelectedImage(selectedImage - 1);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedImage === property?.images.length - 1) {
      setSelectedImage(0);
      return;
    }
    setSelectedImage(selectedImage + 1);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isError) {
    return <div>{t("gallery.error")}</div>;
  }

  return (
    <div className={cl.root}>
      <div className='wrapper'>
        <div className={cl.back} onClick={() => navigate(`/property/${id}`)}>
          <div className={cl.icon}>
            <Icon name='arrowRight' />
          </div>
          <div className={cl.backText}>{t("gallery.back")}</div>
        </div>
        <div className={cl.mainImage}>
          {property?.video ? (
            <video
              className={cl.img}
              src={import.meta.env.VITE_UPLOAD_URL + property?.video}
              controls
            ></video>
          ) : (
            <img
              onClick={() =>
                setSelectedImage(
                  // import.meta.env.VITE_UPLOAD_URL + property?.images[0]
                  0
                )
              }
              className={cl.img}
              src={import.meta.env.VITE_UPLOAD_URL + property?.images[0]}
              alt='main'
            />
          )}
        </div>
        <div className={cl.otherImages}>
          {property?.images.map((image, index) => {
            if (index === 0 && !property?.video) {
              return null;
            }
            return (
              <div className={cl.imageDiv}>
                <img
                  className={cl.img}
                  key={`${index} list`}
                  src={import.meta.env.VITE_UPLOAD_URL + image}
                  alt='other'
                  onClick={() =>
                    // setSelectedImage(import.meta.env.VITE_UPLOAD_URL + image)
                    setSelectedImage(index)
                  }
                />
              </div>
            );
          })}
        </div>
        {selectedImage != null ? (
          <div
            className={cl.overlay}
            onClick={() => {
              setSelectedImage(null);
            }}
          >
            <div className={cl.exit}>
              <Icon name={"close"} />
            </div>
            <div className={cl.control} onClick={prevImage}>
              {"<"}
            </div>
            <div className={cl.bigImage}>
              <img
                src={
                  import.meta.env.VITE_UPLOAD_URL +
                  property?.images[selectedImage]
                }
                className={cl.img}
                alt=''
              />
            </div>
            <div className={cl.controlR} onClick={nextImage}>
              {">"}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
