const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

if (searchInput) {

    searchInput.addEventListener("input", async () => {

        const query = searchInput.value.trim();

        if (!query) {
            suggestions.innerHTML = "";
            return;
        }

        const response = await fetch(
            `/listings/search/suggestions?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        suggestions.innerHTML = "";

        data.forEach(listing => {

            suggestions.innerHTML += `
                <a href="/listings/${listing._id}"
                   class="suggestion-item">
                    <strong>${listing.title}</strong>
                    <br>
                    <small>${listing.location}, ${listing.country}</small>
                </a>
            `;
        });
    });

}