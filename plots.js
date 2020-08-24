function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
    });
})}

init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

//Skill drill 12.4.3
// modify the buildMetadata() function to populate the Demographic Info panel with the rest of the demographic data when a menu option is selected:
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(key.toUpperCase() + ': ' + value); 
      })
    });
};

//Create a horizontal bar chart to display the top 10 OTUs found in that individual.
function buildCharts(sample) {
  d3.json('samples.json').then(function ({ samples, metadata }) {
    var result = samples.filter(sampleObj => sampleObj.id == sample)[0];
    
    console.log(result);
    //Save top 10 otu_ids to array
    var Top10_Otu_Ids = result.otu_ids.map((row) => `OTU ID: ${row}`).slice(0, 10);
    console.log(Top10_Otu_Ids);
    //Save top 10 sample_values to array
    var Top10_SampleValues = result.sample_values.slice(0, 10); 
    console.log(Top10_SampleValues);
    //Save top 10 otu_labels to array
    var Top10_Otu_Labels = result.otu_labels.slice(0, 10);
    console.log(Top10_Otu_Labels);
    //Save complete results for otu_ids, sample_values, otu_labels and wfreq
    Otu_Ids = result. otu_ids;
    Sample_Values = result.sample_values;
    Otu_Labels = result.otu_labels;

    // Save wash frequency
    var Meta_Data = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    var Wash_Freq = Meta_Data.wfreq;
      console.log(Wash_Freq);


    //Create a trace for Horizontal Bar Chart
    var HBar_Trace = [{
      x: Top10_SampleValues,
      y: Top10_Otu_Ids,
      text: Top10_Otu_Labels,
      name: "Top 10 OTUs",
      type: "bar",
      orientation: "h",
      marker: {
        color: "teal"
      }
    }];


    //Create a layout for buildChartsTrace
    var HBar_Layout = {
      title: "Top 10 OTUs",
      yaxis: {autorange:"reversed"},
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      paper_bgcolor: "gray",
      plot_bgcolor: "gray"
    };


    //Create a trace
    var Bubble_Trace = [{
      x: Otu_Ids,
      y: Sample_Values,
      text: Otu_Labels,
      mode: 'markers',
      marker: {
        size: Sample_Values,
        color: Otu_Ids,
        colorscale: "Portland"
      },
      font: {
        color: "white",
      },
    }];
    
    // layout for bubble chart
    var Bubble_layout = {
      xaxis: { title: "OTU ID"},
      height: 450,
      width: 950,
      paper_bgcolor: "gray",
      plot_bgcolor: "gray"
    };

    var Gauge_Trace = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: Wash_Freq,
        title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9]},
          bar: {color: "gray"},
          steps: [
            { range: [0, 1], color: "#b2dfdb" },
            { range: [1, 2], color: "#80cbc4" },
            { range: [2, 3], color: "#4db6ac" },
            { range: [3, 4], color: "#26a69a" },
            { range: [4, 5], color: "#009688" },
            { range: [5, 6], color: "#00897b" },
            { range: [6, 7], color: "#00796b" },
            { range: [7, 8], color: "#00695c" },
            { range: [8, 9], color: "#004d40" }
          ]
        },
    }];
    //Create the Gauge layout
    var Gauge_layout = { 
      width: 500,
      height: 500,
      margin: { t: 0, b: 0 },
      paper_bgcolor: "gray",
      plot_bgcolor: "gray"
    };
  
    //Create the plot for Horizontal Bar Chart, Bubble Chart and Gauge for Top 10 OTUs
    Plotly.newPlot("bar",HBar_Trace, HBar_Layout);
    Plotly.newPlot("bubble",Bubble_Trace, Bubble_layout);
    Plotly.newPlot("gauge", Gauge_Trace, Gauge_layout);
  });
};

// open page with info for subject Id 940
optionChanged(940);