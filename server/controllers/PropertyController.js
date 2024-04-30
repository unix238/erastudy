import PropertyService from "../services/PropertyService.js";

class PropertyController {
  async getAll(req, res) {
    const response = await PropertyService.getAll();
    return res.status(response.status).json(response);
  }

  async getBought(req, res) {
    const response = await PropertyService.getBoughtProperties(
      req.user.data._id
    );
    return res.status(response.status).json(response);
  }

  async getDeveloper(req, res) {
    const response = await PropertyService.getDeveloper(req.params.id);
    return res.status(response.status).json(response);
  }

  async getById(req, res) {
    const response = await PropertyService.getById(req.params.id);
    return res.status(response.status).json(response);
  }

  async uploadImage(req, res) {
    try {
      const images = req.files.map((file) => file.path);
      return res.status(200).json(images);
    } catch (e) {}
  }

  async getAllSales(req, res) {
    try {
      const { page, limit, main } = req.query;
      const response = await PropertyService.getAllSales(page, limit, main);
      return res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async getAllAuctions(req, res) {
    try {
      const { page, limit, main } = req.query;
      const response = await PropertyService.getAllAuctions(page, limit, main);
      return res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async getAllBusinesses(req, res) {
    try {
      const { page, limit, main } = req.query;
      const response = await PropertyService.getAllBusinesses(
        page,
        limit,
        main
      );
      return res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async getAllInvestOffers(req, res) {
    try {
      const { page, limit, main } = req.query;
      const response = await PropertyService.getAllInvestOffers(
        page,
        limit,
        main
      );
      return res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async getFilteredProperties(req, res) {
    try {
      const { page, limit } = req.query;
      const { filters, currentSort } = req.body;
      const { properties, totalProperties } =
        await PropertyService.getFilteredProperties(
          filters,
          currentSort,
          page,
          limit
        );

      if (properties) {
        res.setHeader("x-total-count", totalProperties);
        res.setHeader("Access-Control-Expose-Headers", "x-total-count");
        res.status(200).json(properties);
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async getAllProperties(req, res) {
    try {
      const { page, limit } = req.query;
      const currentSort = req.body;
      const { properties, totalProperties } =
        await PropertyService.getAllProperties(page, limit, currentSort);
      if (properties) {
        res.setHeader("x-total-count", totalProperties);
        res.setHeader("Access-Control-Expose-Headers", "x-total-count");
        return res.status(200).json(properties);
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async getCountProperties(req, res) {
    try {
      const filters = req.body;
      const { maxPrice, count } = await PropertyService.getCountProperties(
        filters
      );
      return res.status(200).json({ maxPrice, count });
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async contact(req, res) {
    try {
      console.log(req.body);
      const { id } = req.body;
      const response = await PropertyService.contact(req.user.data._id, id);
      return res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async getCities(req, res) {
    try {
      const response = await PropertyService.getCities();
      return res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async getCountries(req, res) {
    try {
      const response = await PropertyService.getCountries();
      return res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }
}

export default new PropertyController();
