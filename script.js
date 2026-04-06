const searchBox = document.getElementById("searchBox");
const infoBox = document.getElementById("info");

const textBox = document.getElementById("textBox");
const radioMovie = document.getElementById("movie");
const radioShow = document.getElementById("show");

const providerBox = document.getElementById("providerBox");

let base_url = "https://api.themoviedb.org/3/search/movie?api_key=5ee27fb0df47b96f71fb0b700b30b96c&query=";
let provider_base_url = "https://api.themoviedb.org/3/movie/id/watch/providers?api_key=5ee27fb0df47b96f71fb0b700b30b96c";

let flatrate_div;
let rent_div;
let buy_div;

function radioButton()
{
    if (radioMovie.checked)
    {
        textBox.placeholder = "Enter a Movie";
        base_url = `https://api.themoviedb.org/3/search/movie?api_key=5ee27fb0df47b96f71fb0b700b30b96c&query=`;
        provider_base_url = "https://api.themoviedb.org/3/movie/id/watch/providers?api_key=5ee27fb0df47b96f71fb0b700b30b96c";
    }
    else
    {
        textBox.placeholder = "Enter a Show/Series";
        base_url = `https://api.themoviedb.org/3/search/tv?api_key=5ee27fb0df47b96f71fb0b700b30b96c&query=`;
        provider_base_url = "https://api.themoviedb.org/3/tv/id/watch/providers?api_key=5ee27fb0df47b96f71fb0b700b30b96c";

    }
}

function back()
{
    searchBox.hidden = false;
    infoBox.hidden = true;

    textBox.value = "";

    try 
    {
        flatrate_div.remove()
        rent_div.remove()
        buy_div.remove()
    }
    catch 
    {
        buy_div.remove()
        rent_div.remove()
        flatrate_div.remove()
    }
}

async function search()
{
    if (textBox.value != "")
    {
        let userInput = textBox.value;
        searchBox.hidden = true;
        infoBox.hidden = false;

        let provider_logo_base_url = "https://image.tmdb.org/t/p/original";
        
        let result = userInput.replaceAll(" ", "?");
        let url = base_url + "" + result;

        let response = await fetch(url);
        let data = await response.json();

        let provider_url = provider_base_url.replace("id", data.results[0].id)
        let provider_response = await fetch(provider_url);
        let provider_data = await provider_response.json();

        
        let info = document.getElementById("infoBox");
        let poster = document.getElementById("posterImage");

        poster.src = `https://image.tmdb.org/t/p/original${data.results[0].poster_path}`;

        if (radioMovie.checked)
        {
            info.innerHTML = `
            <b>Title:</b> ${data.results[0].title}<br>
            <b>Released:</b> ${data.results[0].release_date}<br>
            <b>Rating:</b> ${data.results[0].vote_average}<br>
            <b>Description:</b> ${data.results[0].overview}
            `;
        }
        else
        {
            info.innerHTML = `
            <b>Title:</b> ${data.results[0].name}<br>
            <b>First Aired:</b> ${data.results[0].first_air_date}<br>
            <b>Rating:</b> ${data.results[0].vote_average}<br>
            <b>Description:</b> ${data.results[0].overview}
            `;
        }

        if (provider_data.results.US.flatrate != undefined)
        {
            flatrate_div = document.createElement("div");
            let flatrate_h2 = document.createElement("h2");

            flatrate_h2.textContent = "Available with Subscription";

            flatrate_div.appendChild(flatrate_h2);
            providerBox.appendChild(flatrate_div);
            for (let provider = 0; provider < provider_data.results.US.flatrate.length; provider++)
            {
                let provider_logo_url = provider_logo_base_url + "" + provider_data.results.US.flatrate[provider].logo_path;
                
                let img = document.createElement("img");
                img.id = "img";

                img.src = provider_logo_url;
                img.alt = provider_data.results.US.flatrate[provider].provider_name;
                
                flatrate_div.appendChild(img);
            }
        }

        if (provider_data.results.US.rent != undefined)
        {
            rent_div = document.createElement("div");
            let rent_h2 = document.createElement("h2");

            rent_h2.textContent = "Rent";

            rent_div.appendChild(rent_h2);
            providerBox.appendChild(rent_div);
            for (let provider = 0; provider < provider_data.results.US.rent.length; provider++)
            {
                let provider_logo_url = provider_logo_base_url + "" + provider_data.results.US.rent[provider].logo_path;
                
                let img = document.createElement("img");
                img.id = "img";

                img.src = provider_logo_url;
                img.alt = provider_data.results.US.rent[provider].provider_name;
                
                rent_div.appendChild(img);
            }
        }

        if (provider_data.results.US.buy != undefined)
        {
            buy_div = document.createElement("div");
            let buy_h2 = document.createElement("h2");

            buy_h2.textContent = "Buy";

            buy_div.appendChild(buy_h2);
            providerBox.appendChild(buy_div);
            for (let provider = 0; provider < provider_data.results.US.buy.length; provider++)
            {
                let provider_logo_url = provider_logo_base_url + "" + provider_data.results.US.buy[provider].logo_path;
                
                let img = document.createElement("img");
                img.id = "img";

                img.src = provider_logo_url;
                img.alt = provider_data.results.US.buy[provider].provider_name;
                
                buy_div.appendChild(img);
            }
        }
    }
    else
    {
        if (radioMovie.checked)
        {
            window.alert("Text box is empty. Please enter a movie name.");
        }
        else
        {
            window.alert("Text box is empty. Please enter a show name.");
        }
    }
}