import React from "react";
import Slider from "react-slick";

const SliderSlick = (props) => {
  const score = props.dashboardData.user_details;
  const sliderArray = [
    { id: "1", name: "Leadership", score: score.ld_roles ? score.ld_roles  : '0'},
    { id: "2", name: "Scholarship", score: score.sc_roles ? score.sc_roles : '0'} ,
    { id: "4", name: "Citizenship", score: score.sc_roles ? score.ct_roles : '0'} ,
    { id: "3", name: "Sportsmanship", score: score.sp_roles ? score.sp_roles : '0'} ,

    { id: "7", name: "Leadership", score: score.ld_honors ? score.ld_honors : '0' },
    { id: "5", name: "Scholarship", score: score.sc_honors ? score.sc_honors : '0'},
    { id: "8", name: "Citizenship", score: score.ct_honors ? score.ct_honors : '0'},
    { id: "6", name: "Sportsmanship", score: score.sp_honors ? score.sp_honors : '0'},
  ];

  const handleChangeSlide = (index) => {
    if (index === 0) {
      props.setHeaderText("Activities and Roles");
    } else {
      props.setHeaderText("Honors and Awards");
    }
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          centerMode: false,
          variableWidth: false
        },
      },
    ],
    afterChange: (index) => handleChangeSlide(index),
  };

  return (
    <div className="slider-container chart-score-slider">
      <Slider {...settings}>
        {sliderArray.map((item, index) => (
          <div className="chart-score-holder" key={index}>
            <span>{item.name}</span>
            <h4>{item.score}</h4>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderSlick;
