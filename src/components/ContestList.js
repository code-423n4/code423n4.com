import React from "react";
import ContestTile from "./ContestTile";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

const breakpoints = {
  750: {
    slidesPerView: 2,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 2.5,
    spaceBetween: 32,
  },
};

const ContestList = ({ contests, updateContestStatus, user, swiper }) => {
  return (
    <div>
      {swiper ? (
        <div className="swiper-holder">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={32}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            breakpoints={breakpoints}
          >
            {contests.map((contest) => (
              <SwiperSlide key={contest.id}>
                <ContestTile
                  contest={contest}
                  key={contest.id}
                  updateContestStatus={updateContestStatus}
                  user={user}
                  reduced="reduced"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        contests.map((contest) => (
          <ContestTile
            contest={contest}
            key={contest.id}
            updateContestStatus={updateContestStatus}
            user={user}
          />
        ))
      )}
    </div>
  );
};

export default ContestList;
