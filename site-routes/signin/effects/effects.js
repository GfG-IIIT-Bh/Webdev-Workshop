const signInEndpoint = "/api/signin";
const instanceAxios = axios.create({
  // timeout: 8000,
});
const reqListener = (method, url, data) => {
  return new Promise((resolve, reject) => {
    instanceAxios({
      method: method,
      url: url,
      data: data,
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
const getToken = (key) => {
  const tokenFromStorage = localStorage.getItem("access_token");
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
const setCookie = (key, value, exdays) => {
  localStorage.setItem(key, value);
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = key + "=" + value + ";path=/";
  document.cookie = expires + ";path=/";
};
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  let data = {
    email: form.email.value,
    password: form.password.value,
  };
  console.log(data);
  const { success, err } = await reqListener("post", signInEndpoint, data);
  if (success && success.success === true) {
    console.log(success);
    document.getElementById("res-mssg").innerText = success.message;
    setCookie("access_token", success.token, 7); //expires in 30 days
    location.href = "/dashboard";
  } else if (err) {
    document.getElementById("res-mssg").innerText = err.message;
  }
});
