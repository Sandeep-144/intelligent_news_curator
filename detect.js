//    AIzaSyCXtk5LZ7B2TmKRsYMEhY05diknK0XZSio
//    Fact check
document.getElementById("checkBtn").addEventListener("click", async () => {
  const input = document.getElementById("newsInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!input) {
    resultDiv.innerHTML = "<p>Please enter a topic to fact-check.</p>";
    return;
  }

  resultDiv.innerHTML = "<p>Searching for fact checks...</p>";

  const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(input)}&key=AIzaSyCXtk5LZ7B2TmKRsYMEhY05diknK0XZSio`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.claims || data.claims.length === 0) {
      resultDiv.innerHTML = "<p>No fact checks found for this topic.</p>";
      return;
    }

    resultDiv.innerHTML = "<h2>🔎 Fact Checks:</h2>";

    data.claims.forEach(claim => {
      const claimText = claim.text || "No text";
      const publisher = claim.claimReview?.[0]?.publisher?.name || "Unknown Publisher";
      const url = claim.claimReview?.[0]?.url || "#";
      const rating = claim.claimReview?.[0]?.text || "No verdict";

      const block = `
        <div class="fact">
          <p><strong>Claim:</strong> ${claimText}</p>
          <p><strong>Rating:</strong> ${rating}</p>
          <p><strong>Publisher:</strong> ${publisher}</p>
          <a href="${url}" target="_blank">Read more</a>
        </div>
      `;

      resultDiv.innerHTML += block;
    });
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "<p>Error retrieving fact checks. Please try again later.</p>";
  }
});


