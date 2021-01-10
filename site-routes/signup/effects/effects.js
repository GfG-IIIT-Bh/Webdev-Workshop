var img_base64;
const signUpEndpoint = "/api/signup";
const instanceAxios = axios.create({
  // timeout: 10000,
});
const reqListener = (method, url, data) => {
  return new Promise((resolve, reject) => {
    instanceAxios({
      method: method,
      url: url,
      data: data,
      // headers: {
      //   Authorization: "Bearer " + getToken("access_token"),
      // },
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
const readImageFile = (files) => {
  file = files[0];
  console.log(file);
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    img_base64 = reader.result.toString();
    document.getElementById("avatar").src = img_base64;
  };
};

document.querySelector("#signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  const name = form.name.value;
  const password = form.password.value;
  const re_password = form.re_password.value;
  //checking passwords
  if (password != re_password) {
    alert("Passwords don't match, re-enter passwords");
    form.password.value = "";
    form.re_password.value = "";
    return;
  }
  if (!img_base64) {
    alert("Please Upload a Profile Picture");
    return;
  }
  const data = {
    email,
    password,
    name,
    img_base64,
  };
  console.log(data);
  const { success, err } = await reqListener("POST", signUpEndpoint, data);
  console.log(success, err);
  if (success && success.success) {
    document.getElementById("logs").innerText = success.message;
    document.getElementById("logs").style.visibility = "visible";

    setTimeout(() => {
      location.href = "/signin";
    }, 500);
  } else {
    document.getElementById("logs").innerText = err.message;
    document.getElementById("logs").style.visibility = "visible";
  }
});
