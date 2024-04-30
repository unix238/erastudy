import { $host, $authHost } from "./index";

class PropertyController {
  async getAll() {
    try {
      const req = await $host.get("property/");
      return req.data;
    } catch (e) {
      return null;
    }
  }

  async getSales(page = 1, limit = 5, main = false) {
    try {
      const req = await $host.get("property/sales", {
        params: {
          page,
          limit,
          main,
        },
      });
      return req.data;
    } catch (e) {
      return null;
    }
  }

  async getAuctions(page = 1, limit = 5, main = false) {
    try {
      const req = await $host.get("property/auctions", {
        params: {
          page: page,
          limit: limit,
          main: main,
        },
      });
      return req.data;
    } catch (e) {
      return null;
    }
  }

  async getBusinesses(page = 1, limit = 5, main = false) {
    try {
      const req = await $host.get("property/businesses", {
        params: {
          page: page,
          limit: limit,
          main: main,
        },
      });
      return req.data;
    } catch (e) {
      return null;
    }
  }

  async getInvestOffers(page = 1, limit = 5, main = false) {
    try {
      const req = await $host.get("property/investOffers", {
        params: {
          page: page,
          limit: limit,
          main: main,
        },
      });
      return req.data;
    } catch (e) {
      return null;
    }
  }

  async getProperty(id) {
    try {
      const req = await $host.get(`property/id/${id}`);
      return req.data;
    } catch (e) {
      return null;
    }
  }

  async getDeveloper(id) {
    try {
      const req = await $host.get(`property/developer/${id}`);
      return req.data;
    } catch (e) {
      return null;
    }
  }

  async getFilteredProperties(filters, currentSort, page, limit) {
    try {
      const req = await $host.post(
        `property/getFilters?page=${page}&limit=${limit}`,
        {
          filters,
          currentSort,
        }
      );
      return req;
    } catch (e) {
      return null;
    }
  }

  async getAllProperties(page, limit, currentSort) {
    try {
      const req = await $host.post(
        `property/getAllProperties?page=${page}&limit=${limit}`,
        currentSort
      );
      return req;
    } catch (e) {
      return null;
    }
  }

  async getCountProperties(filters) {
    try {
      const req = await $host.post("property/getCountProperties", filters);
      return req.data;
    } catch (e) {
      return null;
    }
  }

  async removeFavorite(property) {
    try {
      const req = await $authHost.post("auth/remove-favorite", {
        property,
      });
      return req;
    } catch (e) {
      return null;
    }
  }

  async addFavorite(property) {
    try {
      const req = await $authHost.post("auth/add-favorite", {
        property,
      });
      return req;
    } catch (e) {
      return null;
    }
  }

  async getBuyHistory() {
    try {
      const req = await $authHost.get("property/getBought");
      if (req.status === 200) {
        return req.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async cotact(id) {
    try {
      const req = await $authHost.post("property/contact", { id });
      if (req.status === 200) {
        return req.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

}

export default new PropertyController();
