const dashboardEndpoint = "/api/dashboard/";
const cardTemplate = document.getElementById("card-template").innerHTML;
const instanceAxios = axios.create({
  // timeout: 80000,
});
const getToken = (key) => {
  const tokenFromStorage = localStorage.getItem(key);
  var name = key + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return tokenFromStorage;
};
const reqListener = (method, url) => {
  return new Promise((resolve, reject) => {
    instanceAxios({
      method: method,
      url: url,
      headers: {
        Authorization: "Bearer " + getToken("access_token"),
      },
    })
      .then((res) => {
        // console.log(res.data);
        resolve({
          success: res.data,
        });
      })
      .catch((err) => {
        // console.log(err.response.data);
        resolve({
          err: err.response.data,
        });
      });
  });
};
const arrColor = [
  "#41a2f1",
  "#4e62b0",
  "#F76C6C",
  "#a1aff8",
  "#f4de6a",
  "#77A6F7",
  "#F4976C",
  "#41B3A3",
  "#97CAEF",
  "#97efbc",
];
const makeCards = (arr) => {
  var content = "";
  arr.forEach((member, index) => {
    const html = Mustache.render(cardTemplate, {
      email: member.email,
      name: member.name,
      userImage: member.userImage,
      color: arrColor[index % arrColor.length],
    });
    content += html;
  });
  document
    .querySelector("#members-list")
    .insertAdjacentHTML("afterbegin", content);
  document.querySelector("#loader").style.display = "none";
  document.querySelector("#members-list").style.display = "flex";
};

const getRoomMembers = async () => {
  const { success, err } = await reqListener("get", dashboardEndpoint);
  if (success && success.success) {
    const arrData = success.data;
    const userData = success.user;
    document.getElementById("avatar").src = userData.userImage;
    document.getElementById("avatar-name").innerText =
      "Welcome " + userData.name + "!";
    //init loading roomdata
    makeCards(arrData);
  } else {
    alert("Authentication failed");
  }
  console.log(success, err);
};

const init = () => {
  const token = getToken("access_token");
  if (token) {
    getRoomMembers();
  } else {
    alert("No authentication, sigin again.");
    location.href = "/signin";
  }
};
init();
