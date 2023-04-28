let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
let req = new XMLHttpRequest() // this is how we import the json data 

let data // store the response
let values = [] // store the array of dates in the json data

let heightScale  // determine the height of the bar
let xScale // where the bar is going to be positioned on the canvas
let xAxisScale // drawing the x axis
let yAxisScale // drawing the y axis

let width = 850
let height = 650
let padding = 70

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    // creating a scale for bar height 
    heightScale = d3.scaleLinear()
                    .domain([0,d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([0, height - 2 * padding])

    // creating a scale for horizontally placing bars 
    xScale = d3.scaleLinear()
                .domain([0, values.length - 1])
                .range([padding, width - padding])
    
    // convert the string of dates into numerical data, store in datesArray 
    let datesArray = values.map((item) => {
        return new Date(item[0])
    })
    console.log(datesArray)

    // creating a scale for the x-axis of dates 
    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width - padding])
    
    // creating a scale for the y-axis of GDP
    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([height - padding, padding])
}

let drawBars = () => {
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / values.length)

        // create a property "data-date" containing date values
        .attr('data-date', (item) => {
            return item[0]
        })

        // create a property "data-gdp" containing gdp values
        .attr('data-gdp', (item) => {
            return item[1]
        })

        // make sure the bars are on the correct positions on the x-axis
        .attr('x', (item, index) => {
            return xScale(index)
        })

        // make sure each bar element's height represent the data's corresponding gdp
        // this step does not ensure the correct positions on the y-axis, only the height
        .attr('height', (item) => {
            return heightScale(item[1])
        })

        // position the bars correctly on the y-axis
        .attr('y', (item) => {
            return (height - padding - heightScale(item[1]))
        })

        .on('mouseover', (item) => {
            tooltip.transition()
                    .style('visibility', 'visible')
            tooltip.text(item[0] + "  $" + item[1] + " Billion")
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                    .style('visibility', 'hidden')

        document.querySelector('#tooltip').setAttribute('data-date', item[0])
        })
}

let generateAxes = () => {

    // create a <g> element x-axis with a corresponding id = 'x-axis'
    let xAxis = d3.axisBottom(xAxisScale)
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')') // push the x-axis down to the bottom

    // create a <g> element y-axis with a correpsonding id = 'y-axis
    let yAxis = d3.axisLeft(yAxisScale)
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)') // push the y-axis a little bit to the right 

    svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -120) // Position the text along the y-axis
        .attr('y', 100) // Position the text along the x-axis
        .style('text-anchor', 'middle') // Center the text horizontally
        .text('Gross Domestic Product');

    svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'end')
        .attr('x', width - padding + 15)
        .attr('y', height - padding / 2 + 10)
        .text('Year');
}

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    console.log(values)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()

}
req.send()