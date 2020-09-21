// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("data/samples.json").then((importedData) => {
    console.log(importedData);
    var data = importedData;
    var names = data.names;
    var metadata = data.metadata;
    var samples = data.samples;

    console.log(metadata);

    // Initializes the page with a default plot
    function init() {
  

        selectName = document.getElementById('selDataset')
        names.forEach(name => {
            var option = document.createElement('option');
            option.innerHTML = name
            option.value = name
            selectName.appendChild(option);
        })
        d3.selectAll("body").on("change", updatePlotly);
        function updatePlotly(){
            // Use D3 to select the dropdown menu
            var dropdownMenu = d3.select("#selDataset");

             // Assign the value of the dropdown menu option to a variable
            var dataset = dropdownMenu.node().value;
            console.log(dataset)
            var filteredSamples = samples.filter(samples => samples.id == dataset)
            var filteredMetaData = metadata.filter(metadata => metadata.id == dataset)
            console.log(filteredSamples)
            console.log(filteredMetaData)

            
            var otu_ids = filteredSamples[0].otu_ids;
            var sample_values = filteredSamples[0].sample_values;
            var otu_labels = filteredSamples[0].otu_labels;

            var x = sample_values.slice(0,10).reverse()
            var y = otu_ids.slice(0,10).reverse()

            console.log(x)
            console.log(y)

            // Create the Trace for the first chart
            var trace1 = {
                x: x,
                y: y,
                type: "bar",
                orientation: 'h'
            };
            // Create the data array for the plot
            var data1 = [trace1];

            // Define the plot layout
            var layout = {
                title: "Top 10 OTU per Subject",
                height: 600,
                width: 400,
                xaxis: {
                    title: "Sample values",
                },
                yaxis: {
                    title: "OTU ID",
                    type: 'category'
                }
            };

            // Plot the chart to a div tag with id "bar"
            Plotly.newPlot("bar", data1, layout);

            // Bubble Chart
            var trace2 = {
                x: otu_ids,
                y: sample_values,
                mode: 'markers',
                text: otu_labels['text'],
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            };

            var data2 = [trace2];

            var layout = {
                title: 'Marker Size',
                showlegend: false,
                height: 600,
                width: 1000
            };

            Plotly.newPlot('bubble', data2, layout);

            // Insert demographic info
            var age=filteredMetaData[0].age;
            var bbtype = filteredMetaData[0].bbtype;
            var ethnicity = filteredMetaData[0].ethnicity;
            var gender = filteredMetaData[0].gender;
            var  id = filteredMetaData[0].id;
            var location = filteredMetaData[0].location;
            var wfreq = filteredMetaData[0].wfreq;

            // Then, select the unordered list element by class name
            var list = d3.select("#sample-metadata");

            // remove any children from the list to
            list.html("");

            // append stats to the list
            list.append("ul")
            list.append("li").text(`id: ${id}`);
            list.append("li").text(`ethnicity: ${ethnicity}`);
            list.append("li").text(`gender: ${gender}`);
            list.append("li").text(`age: ${age}`);
            list.append("li").text(`location: ${location}`)
            list.append("li").text(`bbtype: ${bbtype}`)
            list.append("li").text(`wfreq: ${wfreq}`)
            ;

            var level = parseFloat(wfreq) * 20;

        // Trig to calc marker point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x3 = radius * Math.cos(radians);
        var y3 = radius * Math.sin(radians);

        // Path: creating the triangle shape
        var mainPath = 'M -.0 -0.05 L .0 0.05 L ',
            pathX = String(x3),
            space = ' ',
            pathY = String(y3),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX, space, pathY, pathEnd);
        // Setting data to plot gauge chart
        var data3 = [{
                type: 'scatter',
                x3: [0],
                y3: [0],
                marker: { size: 28, color: '850000' },
                showlegend: false,
                name: 'speed',
                text: level,
                hoverinfo: 'text+name'
            },
            {
                values: [
                    50 / 9,
                    50 / 9,
                    50 / 9,
                    50 / 9,
                    50 / 9,
                    50 / 9,
                    50 / 9,
                    50 / 9,
                    50 / 9,
                    50
                ],
                rotation: 90,
                text: ["8-9",
                    "7-8",
                    "6-7",
                    "5-6",
                    "4-5",
                    "3-4",
                    "2-3",
                    "1-2",
                    "0-1",
                    ""
                ],
                textinfo: 'text',
                textposition: 'inside',
                marker: {
                    colors: ["rgba(128, 182, 134, 1)",
                        "rgba(133, 189, 140, 1)",
                        "rgba(135, 192, 128, 1)",
                        "rgba(183, 205, 140, 1)",
                        "rgba(214, 228, 149, 1)",
                        "rgba(229, 233, 177, 1)",
                        "rgba(233, 231, 201, 1)",
                        "rgba(244, 241, 229, 1)",
                        "rgba(247, 243, 236, 1)",
                        "rgba(255, 255, 255, 0)"
                    ]
                },
                labels: [
                    "8-9",
                    "7-8",
                    "6-7",
                    "5-6",
                    "4-5",
                    "3-4",
                    "2-3",
                    "1-2",
                    "0-1",
                    ""
                ],
                hoverinfo: 'label',
                hole: .5,
                type: 'pie',
                showlegend: false
            }
        ];
        var layout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week',
            height: 600,
            width: 500,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            }
        };

        Plotly.newPlot('gauge', data3, layout);
        }
    }
    init();
})