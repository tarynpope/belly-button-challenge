// Fetch the JSON data and console log it
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Populate the dropdown with the IDs
    var selector = d3.select("#selDataset");
    data.names.forEach((name) => {
        selector
            .append("option")
            .text(name)
            .property("value", name);
    });

    // Initialize the dashboard with the first sample
    const firstSample = data.names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

    // Update charts and metadata when a new sample is selected
    selector.on("change", () => {
        const newSample = selector.property("value");
        buildCharts(newSample);
        buildMetadata(newSample);
    });
});

// Function to build the bar chart
function buildCharts(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        const sampleData = data.samples.filter(d => d.id === sample)[0];

        // Bar Chart
        var barData = [{
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        var barLayout = {
            title: "Top 10 OTUs",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Bubble Chart
        var bubbleData = [{
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Earth"
            }
        }];

        var bubbleLayout = {
            title: "OTU Samples",
            margin: { t: 30 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// Function to build the metadata
function buildMetadata(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        const metadata = data.metadata.filter(d => d.id === parseInt(sample))[0];
        var panel = d3.select("#sample-metadata");

        panel.html("");
        Object.entries(metadata).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}
