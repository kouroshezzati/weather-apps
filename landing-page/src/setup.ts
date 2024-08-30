export function setup(element: HTMLButtonElement) {
  let isAppOpen = false;
  element.addEventListener("click", () => {
    const container = document.getElementById("weather-app-container");
    const appBtn = document.getElementById("loader")!;
    if (!container) return;
    if (!isAppOpen) {
      /*
        TODO: the url must be conditionaly for development and production environments
        like https://weather-page.web.app for production 
      */
      container.innerHTML =
        '<iframe src="http://localhost:5173/" allow="geolocation" style="width:100%; height:100%;"></iframe>';
      isAppOpen = true;
      appBtn.textContent = "Close the weather app";
    } else {
      container.querySelector("iframe")?.remove();
      isAppOpen = false;
      appBtn.textContent = "Load the weather app";
    }
  });
}
