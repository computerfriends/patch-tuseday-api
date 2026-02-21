(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/cloudflare-worker-rest-api/response.js
  var require_response = __commonJS({
    "node_modules/cloudflare-worker-rest-api/response.js"(exports, module) {
      module.exports = class AppRes {
        static {
          __name(this, "AppRes");
        }
        constructor(request) {
        }
        send(data, status = 200) {
          return new Response(JSON.stringify(data), {
            status,
            headers: {
              "content-type": "application/json"
            }
          });
        }
      };
    }
  });

  // node_modules/cloudflare-worker-rest-api/request.js
  var require_request = __commonJS({
    "node_modules/cloudflare-worker-rest-api/request.js"(exports, module) {
      module.exports = class AppReq {
        static {
          __name(this, "AppReq");
        }
        constructor(request) {
          this.request = request;
          this.params = {};
        }
        async body() {
          try {
            return await this.request.json();
          } catch (error) {
            return {};
          }
        }
        query() {
          try {
            let query = {};
            let queryString = this.request.url.split("?")[1];
            queryString.split("&").forEach((el) => {
              const temp = el.split("=");
              if (temp.length === 2) {
                query[temp[0]] = temp[1];
              }
            });
            return query;
          } catch (error) {
            return {};
          }
        }
      };
    }
  });

  // node_modules/cloudflare-worker-rest-api/index.js
  var require_cloudflare_worker_rest_api = __commonJS({
    "node_modules/cloudflare-worker-rest-api/index.js"(exports, module) {
      var res = require_response();
      var req = require_request();
      module.exports = class App {
        static {
          __name(this, "App");
        }
        constructor() {
          this.routes = [];
          this.middlewares = [];
        }
        async handleRequest(request) {
          this.response = new res(request);
          this.request = new req(request);
          let method = request.method;
          let url = "/" + request.url.split("/").slice(3).join("/").split("?")[0];
          let route = this.routes.find((elem) => this.routeCheck(elem.url, url) && elem.method === method);
          if (!route) route = this.routes.find((elem) => this.routeCheck(elem.url, url) && elem.method === "*");
          if (route) {
            for (var i = 0; i < this.middlewares.length; i++) {
              await this.middlewares[i].callback(this.request, this.response);
            }
            return await route.callback(this.request, this.response);
          }
          return this.response.send({ status: 0, message: "What, are you lost or something? (Method not found)" }, 404);
        }
        get(url, callback) {
          this.routes.push({
            url,
            method: "GET",
            callback
          });
        }
        post(url, callback) {
          this.routes.push({
            url,
            method: "POST",
            callback
          });
        }
        put(url, callback) {
          this.routes.push({
            url,
            method: "PUT",
            callback
          });
        }
        patch(url, callback) {
          this.routes.push({
            url,
            method: "PATCH",
            callback
          });
        }
        delete(url, callback) {
          this.routes.push({
            url,
            method: "DELETE",
            callback
          });
        }
        any(url, callback) {
          this.routes.push({
            url,
            method: "*",
            callback
          });
        }
        use(var1, var2) {
          if (arguments.length == 2) {
            this.useRouter(var1, var2);
          } else if (arguments.length === 1) {
            this.useMiddleware(var1);
          }
        }
        useMiddleware(callback) {
          arguments.length;
          this.middlewares.push({
            callback
          });
        }
        useRouter(path, router) {
          router.routes.forEach((element) => {
            this.routes.push({
              url: path + (element.url === "/" ? "" : element.url),
              method: element.method,
              callback: element.callback
            });
          });
          router.middlewares.forEach((element) => {
            this.middlewares.push({
              callback: element.callback
            });
          });
        }
        routeCheck(route, requestRoute) {
          let routeArray = route.split("/");
          let requestRouteArray = requestRoute.split("/");
          if (routeArray.length !== requestRouteArray.length) {
            return false;
          }
          try {
            let flag = true;
            routeArray.forEach((elem, index) => {
              if (elem.includes(":") && requestRouteArray[index] && requestRouteArray[index] !== "") {
                this.request.params[elem.substring(1)] = requestRouteArray[index];
              } else {
                if (elem !== requestRouteArray[index]) {
                  flag = false;
                  return;
                }
              }
            });
            return flag;
          } catch (error) {
            return false;
          }
        }
      };
    }
  });

  // index.js
  function getPatchTuesday() {

    var d = new Date(),
        month = d.getMonth(),
        tuesdays= [];

    d.setDate(1);

    // Get the first Monday in the month
    while (d.getDay() !== 2) {
        d.setDate(d.getDate() + 1);
    }

    // Get all the other Tuesdays in the month
     while (d.getMonth() === month) {
        tuesdays.push(new Date(d.getTime()));
        d.setDate(d.getDate() + 7);
    }

    patchTuesday = tuesdays[1]
    return patchTuesday
  }

  function isPatchTuesday() {
    const currentDate = new Date()
    const patchTuesday = getPatchTuesday()

    if (patchTuesday.getDay() === currentDate.getDay()) {
      return true
    } else {
      return false
    }

  }

  function isBWeek() {

    // Returns the ISO week of the date.
  Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }

    const date = new Date()

    const pDate = getPatchTuesday();

    if (date.getWeek() === pDate.getWeek()) {
      return true
    } else {
      return false
    }
  }

  function apiFetch() {

    var response = {}

    response.isPatchTuesday = isPatchTuesday()
    response.isBWeek = isBWeek()

    return response

  }


  __name(apiFetch, "apiFetch");
  var restCfWorker = require_cloudflare_worker_rest_api();
  var app = new restCfWorker();
  addEventListener("fetch", (event) => {
    event.respondWith(app.handleRequest(event.request));
  });
  app.get("/api/v1/patchtuesday", async (req, res) => {
    return res.send(apiFetch());
  });
})();

