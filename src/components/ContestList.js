import React from "react";
import ContestTile from "./ContestTile";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

const ContestList = ({ contests, updateContestStatus, user, swiper }) => {
  return (
    <div>
      {swiper ? (
        <div className="limited-width">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
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
