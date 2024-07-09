// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    allMetadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    function filterMetadataSample(metadata, Prasample) {
      return metadata.filter(obj => obj.id === Prasample);
    }
    
    let selectedMetadata = filterMetadataSample(allMetadata,parseInt(sample));
    let metaData = selectedMetadata[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metaData).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    allSample = data.samples;

    // Filter the samples for the object with the desired sample number
    function filterSamplesample(sampleData, praSample) {
      return sampleData.filter(obj => obj.id === praSample);
    }
    
    let selectedSample = filterSamplesample(allSample,sample);
    let selectedSampledata = selectedSample[0];

    // Get the otu_ids, otu_labels, and sample_values
    otu_ids=selectedSampledata.otu_ids;
    otu_labels=selectedSampledata.otu_labels;
    sample_values=selectedSampledata.sample_values;

    // Build a Bubble Chart
    var BubbleChart = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values, 
        color: otu_ids,  
        colorscale: 'Viridis',  
        showscale: true  
      },
      text: otu_labels, 
      type: 'scatter'
    }];
       // Layout configuration for the bubble chart
       var Bubblelayout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: {
          title: 'OTU ID'
        },
        yaxis: {
          title: 'Number of Bacteria'
        },
        showlegend: false
      }; 

    // Render the Bubble Chart
    Plotly.newPlot('bubble', BubbleChart, Bubblelayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let topTenotu_ids=yticks.slice(0,10);
    topTenotu_ids.reverse();
    let topTensample_values=sample_values.slice(0,10);
    topTensample_values.reverse();
    let BarChart = [
      {
          y: topTenotu_ids, 
          x: topTensample_values,
          type: 'bar',
          orientation: 'h'
      }
  ];  
  // Layout configuration for the chart
  let barLayout = {
    title: 'Top 10 Bacteria Cultures Found'
 };
    // Render the Bar Chart
    Plotly.newPlot("bar", BarChart, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
