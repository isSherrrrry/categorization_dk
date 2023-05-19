import React, { useEffect, useRef } from 'react';

import * as d3 from 'd3';
import './plot.css';
// import logEvent from '../Logger';

const Plot = ({ data, xColumn, yColumn, selectedCategory, setData, zoomTransform, setZoomTransform }) => {
  const svgRef = useRef();
  const zoomRef = useRef();

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Good': return '#BBD6B8';
      case 'Fair': return '#FAEDCD';
      case 'Poor': return '#E74646';
      case 'Null': return 'white';
      default: return 'white';
    }
  };

  const tooltipRef = useRef();


  useEffect(() => {
    if (!data || !xColumn || !yColumn) return;

    // Add category color property to data
    const updatedData = data.map(d => ({...d, color: getCategoryColor(d.category)}));

    const svg = d3.select(svgRef.current);
    const width = parseInt(svg.attr("width"));
    const height = parseInt(svg.attr("height"));

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d[xColumn]))
      .range([40, width - 20]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d[yColumn]))
      .range([height - 20, 20]);

    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    // Gridlines
    const xGridlines = d3.axisBottom(xScale)
      .tickSize(-height + 40)
      .tickFormat('')
      .ticks(10);

    const yGridlines = d3.axisLeft(yScale)
      .tickSize(-width + 60)
      .tickFormat('')
      .ticks(10);

    const zoom = d3.zoom()
      .scaleExtent([0.1, 30]) // Define the zoom limits (min, max)
      .on("zoom", (event) => {
        const { transform } = event;
        // Update the scales based on the zoom event
        const newXScale = transform.rescaleX(xScale);
        const newYScale = transform.rescaleY(yScale);
    
        // Update the gridlines
        svg.select('.x-gridlines').call(xGridlines.scale(newXScale));
        svg.select('.y-gridlines').call(yGridlines.scale(newYScale));
    
        // Maintain the opacity of the gridlines during zoom
        svg.selectAll('.x-gridlines .tick line')
          .style('stroke-opacity', 0.3);
        svg.selectAll('.y-gridlines .tick line')
          .style('stroke-opacity', 0.3);
    
        // Update the axes
        svg.select(".x-axis").call(xAxis.scale(newXScale));
        svg.select(".y-axis").call(yAxis.scale(newYScale));
    
        // Update the position and size of the points
        svg.selectAll(".point")
          .attr("cx", d => newXScale(d[xColumn]))
          .attr("cy", d => newYScale(d[yColumn]));
        
          setZoomTransform(event.transform);
      });

    zoomRef.current = zoom;
    svg.selectAll(".x-gridlines").remove();
    svg.selectAll(".y-gridlines").remove();
    svg.selectAll(".x-axis").remove();
    svg.selectAll(".y-axis").remove();
    svg.selectAll(".point").remove();

    svg.append('g')
      .attr('class', 'x-gridlines')
      .attr('transform', `translate(0, ${height - 20})`)
      .call(xGridlines);

    svg.append('g')
      .attr('class', 'y-gridlines')
      .attr('transform', 'translate(40, 0)')
      .call(yGridlines);

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - 20})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(40, 0)")
      .call(yAxis);

    const onMouseOver = (event, d) => {
        const tooltip = d3.select(tooltipRef.current);
        let content = '';
        for (const key in d) {
            content += `<b>${key}:</b> ${d[key]}<br>`;
        }
        tooltip.html(content)
            .style("opacity", 1)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
        // logEvent('INFO', `User hovered over a point with index: ${data.findIndex(el => el === d)}`);

        
    };

    
    
    const onMouseOut = () => {
    d3.select(tooltipRef.current).style("opacity", 0);
    };

    const onClick = (event, d) => {
      const circle = d3.select(event.target);
      const index = data.findIndex(el => el === d);
      const newData = [...data];
      const newCategory = data[index].category === selectedCategory ? null : selectedCategory;
    
      newData[index] = { ...data[index], category: newCategory };
    
      setData(newData);
    
      // Update the color of the point
      circle.style("fill", getCategoryColor(newCategory));
      // logEvent('INFO', `User clicked on a point with index: ${index}`);
    
      // Save the current zoomTransform state
      if (zoomRef.current) {
        const currentTransform = d3.zoomTransform(svg.node());
        setZoomTransform(currentTransform);
      }
    };

    // Add points
    svg.selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("r", 7)
      .attr("cx", d => xScale(d[xColumn]))
      .attr("cy", d => yScale(d[yColumn]))
      .attr('data-category', null)
      .style("fill", d => getCategoryColor(d.category))
      .style("stroke", "black")
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)
      .on("click", onClick);

    // Apply lower opacity to gridlines
    svg.selectAll('.x-gridlines .tick line')
        .style('stroke-opacity', 0.3);
    svg.selectAll('.y-gridlines .tick line')
        .style('stroke-opacity', 0.3);

    // Call the zoom behavior on the SVG
  
    if (zoomTransform && zoomRef.current) {
      svg.call(zoomRef.current.transform, zoomTransform);
    }

    svg.call(zoom);

    }, [data, xColumn, yColumn, setData, selectedCategory, setZoomTransform]);
    

return (
<div>
<svg ref={svgRef} width="1000" height="600" />
<div ref={tooltipRef} className="tooltip" style={{ opacity: 0 }} />
</div>
);
};

export default Plot;




