import models from "../models/index.js";
import { TGBot } from "../index.js";

class PropertyService {
  async getAll() {
    try {
      const properties = await models.Property.find({
        isSold: false,
        isBooked: false,
        directions: "Менторы",
      });
      return { status: 200, data: properties };
    } catch (e) {
      console.log(e);
      return { status: 500, data: e };
    }
  }

  async getBoughtProperties(userId) {
    try {
      const bought = await models.Sells.find({ user: userId });
      const booked = await models.Bookings.find({ user: userId });
      const files = await models.File.find({ user: userId });
      const auctions = await models.Auction.find({ user: userId });
      return { status: 200, data: { bought, booked, files, auctions } };
    } catch (e) {
      return { status: 500, data: e };
    }
  }

  async getDeveloper(id) {
    try {
      if (!id) return { status: 400, data: "Id not specified", id };
      const developer = await models.Developer.findById(id);
      if (!developer) return { status: 404, data: "Developer not found" };
      return { status: 200, data: developer };
    } catch (e) {
      return { status: 500, data: e };
    }
  }

  async getById(id) {
    try {
      if (!id) return { status: 400, data: "Id not specified", id };
      const property = await models.Property.findById({
        _id: id,
      });
      if (!property) return { status: 404, data: "Property not found" };
      return { status: 200, data: property };
    } catch (e) {
      console.log(e);
      return { status: 500, data: e };
    }
  }

  async uploadImage() {}

  async getAllSales(page = 1, limit = 5, main) {
    const now = new Date();
    if (main == "true") {
      console.log("main");
      const properties = await models.Property.find({
        saleType: "saleStart",
        isSold: false,
        isBooked: false,
        onMainPage: true,
        $or: [
          { isTimer: false },
          {
            isTimer: true,
            $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
          },
        ],
      })
        .skip((page - 1) * limit)
        .limit(limit);
      return { status: 200, data: properties };
    }
    console.log("main");
    const properties = await models.Property.find({
      saleType: "saleStart",
      isSold: false,
      isBooked: false,
      $or: [
        { isTimer: false },
        {
          isTimer: true,
          $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
        },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);
    return { status: 200, data: properties };
  }

  async getAllAuctions(page = 1, limit = 10, main) {
    const now = new Date();
    if (main == "true") {
      const properties = await models.Property.find({
        isSold: false,
        isBooked: false,
        saleType: "auccion",
        onMainPage: true,
        $or: [
          { isTimer: false },
          {
            isTimer: true,
            $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
          },
        ],
      })
        .sort({ timer: 1 })
        .skip((page - 1) * limit)
        .limit(limit);
      return { status: 200, data: properties };
    }

    const properties = await models.Property.find({
      isSold: false,
      isBooked: false,
      saleType: "auccion",
      $or: [
        { isTimer: false },
        {
          isTimer: true,
          $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
        },
      ],
    })
      .sort({ timer: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return { status: 200, data: properties };
  }

  async getAllBusinesses(page = 1, limit = 5, main) {
    const now = new Date();
    if (main == "true") {
      const properties = await models.Property.find({
        saleType: "bussiness",
        isSold: false,
        isBooked: false,
        onMainPage: true,
        $or: [
          { isTimer: false },
          {
            isTimer: true,
            $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
          },
        ],
      })
        .skip((page - 1) * limit)
        .limit(limit);
      return { status: 200, data: properties };
    }
    const properties = await models.Property.find({
      saleType: "bussiness",
      isSold: false,
      isBooked: false,
      $or: [
        { isTimer: false },
        {
          isTimer: true,
          $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
        },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);
    return { status: 200, data: properties };
  }

  async getAllInvestOffers(page = 1, limit = 5, main) {
    const now = new Date();
    if (main == "true") {
      const properties = await models.Property.find({
        saleType: "investOffer",
        isSold: false,
        isBooked: false,
        onMainPage: true,
        $or: [
          { isTimer: false },
          {
            isTimer: true,
            $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
          },
        ],
      })
        .skip((page - 1) * limit)
        .limit(limit);
      return { status: 200, data: properties };
    }
    const properties = await models.Property.find({
      saleType: "investOffer",
      isSold: false,
      isBooked: false,
      $or: [
        { isTimer: false },
        {
          isTimer: true,
          $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
        },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);
    return { status: 200, data: properties };
  }

  async getFilteredProperties(filters, currentSort, page = 1, limit = 12) {
    try {
      const {
        directions,
        isCompleted,
        price,
      } = filters;

      const sortCriteria = {};
      if (currentSort === "priceAscending") {
        sortCriteria.price = 1;
      } else if (currentSort === "priceDescending") {
        sortCriteria.price = -1;
      } else if (currentSort === "roiAscending") {
        sortCriteria.roi = 1;
      } else if (currentSort === "roiDescending") {
        sortCriteria.roi = -1;
      }

      const [minPrice, maxPrice] = price
        ? price.split("-").map(Number)
        : [0, 0];

      const directionConditions =
        directions.length > 0
          ? [{ directions: { $in: directions } }]
          : [];

      const priceConditions =
        price.length > 0 ? [{ price: { $gte: minPrice, $lte: maxPrice } }] : [];

      const isCompletedConditions =
        isCompleted.length > 0 ? [{ isCompleted: { $in: isCompleted } }] : [];

      const now = new Date();
      const timerCondition = {
        isSold: false,
        isBooked: false,
        $or: [
          { isTimer: false },
          {
            isTimer: true,
            $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
          },
        ],
      };
      const filterConditions = {
        $and: [
          ...directionConditions,
          ...priceConditions,
          ...isCompletedConditions,
          { saleType: { $ne: "auccion" } },
        ],
      };

      const finalFilterConditions = {
        ...filterConditions,
        ...timerCondition,
      };

      const totalProperties = await models.Property.find(finalFilterConditions);
      const properties = await models.Property.find(finalFilterConditions)
        .sort(sortCriteria)
        .skip((page - 1) * limit)
        .limit(limit);

      return { properties, totalProperties: totalProperties.length };
    } catch (e) {
      console.log(e);
      return { status: 500, data: e };
    }
  }

  async getAllProperties(page = 1, limit = 12, currentSort) {
    try {
      const now = new Date();
      const query = {
        saleType: { $ne: "auccion" },
        isSold: false,
        isBooked: false,
        $or: [
          { isTimer: false },
          {
            isTimer: true,
            $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
          },
        ],
      };

      let sortCriteria = {};

      if (currentSort === "priceAscending") {
        sortCriteria = { price: 1 };
      } else if (currentSort === "priceDescending") {
        sortCriteria = { price: -1 };
      } else if (currentSort === "roiAscending") {
        sortCriteria = { roi: 1 };
      } else if (currentSort === "roiDescending") {
        sortCriteria = { roi: -1 };
      }

      const totalProperties = await models.Property.find(query);
      const properties = await models.Property.find(query)
        .sort(sortCriteria)
        .skip((page - 1) * limit)
        .limit(limit);
      return { properties, totalProperties: totalProperties.length };
    } catch (e) {
      console.log(e);
      return { status: 500, data: e };
    }
  }

  async getCountProperties(filters) {
    try {
      const { directions, isCompleted, price } =
        filters;

      const [minPrice, maxPrice] = price
        ? price.split("-").map(Number)
        : [0, 0];

      const directionConditions =
        directions.length > 0
          ? [{ directions: { $in: directions } }]
          : [];

      const priceConditions =
        price.length > 0 ? [{ price: { $gte: minPrice, $lte: maxPrice } }] : [];

      const isCompletedConditions =
        isCompleted.length > 0 ? [{ isCompleted: { $in: isCompleted } }] : [];

      const maxPriceProperty = await models.Property.findOne({})
        .sort({ price: -1 })
        .select("price")
        .exec();

      const now = new Date();
      const query = [
        {
          saleType: { $ne: "auccion" },
          isTimer: false,
          isBooked: false,
          isSold: false,
          $or: [
            { isTimer: false },
            {
              isTimer: true,
              $or: [{ timer: { $exists: false } }, { timer: { $gte: now } }],
            },
          ],
        },
      ];

      const countPromises = [
        models.Property.countDocuments(query),
        models.Property.countDocuments({
          $and: [
            ...query,
            { directions: "Книги" },
            ...priceConditions,
            ...isCompletedConditions,
          ],
        }),
        models.Property.countDocuments({
          $and: [
            ...query,
            { directions: "Менторы" },
            ...priceConditions,
            ...isCompletedConditions,
          ],
        }),
        models.Property.countDocuments({
          $and: [
            ...query,
            { directions: "Курсы" },
            ...priceConditions,
            ...isCompletedConditions,
          ],
        }),
        models.Property.countDocuments({
          $and: [
            ...query,
            ...directionConditions,
            ...isCompletedConditions,
            ...priceConditions,
          ],
        }),
        models.Property.countDocuments({
          $and: [
            ...query,
            ...directionConditions,
            ...isCompletedConditions,
            ...priceConditions,
          ],
        }),
        models.Property.countDocuments({
          $and: [
            ...query,
            ...directionConditions,
            ...isCompletedConditions,
            ...priceConditions,
          ],
        }),
        models.Property.countDocuments({
          $and: [
            ...query,
            { isCompleted: true },
            ...directionConditions,
            ...priceConditions,
          ],
        }),
        models.Property.countDocuments({
          $and: [
            ...query,
            { isCompleted: false },
            ...directionConditions,
            ...priceConditions,
          ],
        }),
      ];
      const [
        totalProperties,
        residentialProperty,
        commercialProperty,
        landProperty,
        completed,
        notCompleted,
      ] = await Promise.all(countPromises);
      return {
        status: 200,
        maxPrice: maxPriceProperty.price,
        count: {
          totalProperties,
          residentialProperty,
          commercialProperty,
          landProperty,
          completed,
          notCompleted,
        },
      };
    } catch (e) {
      console.log(e);
      return { status: 500, data: e };
    }
  }
  async contact(userID, propertyId) {
    try {
      const newContact = await models.Contact.create({
        user: userID,
        property: propertyId,
      });

      try {
        console.log("sending tg notification");
        await TGBot.sendMessage(
          process.env.TG_CHAT_ID,
          `Новое уведомление! Лот: ${propertyId}`
        );
      } catch (e) {
        console.log("error sending tg notification");
        console.log(e);
      }

      await newContact.save();
      return { status: 200, data: newContact };
    } catch (e) {
      console.log(e);
      return { status: 500, data: e };
    }
  }
}

export default new PropertyService();
