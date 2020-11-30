// API key
const API_KEY = "YOUR API KEY HERE!";

d3.json("/etc/config.json").then((api_keys) => {
    console.log(api_keys);
})