import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { useNavigate } from "react-router-dom"; // 📌 Importamos useNavigate
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import './Hero.css';

import hero1 from '../../assets/hero_1.jpg';
import hero2 from '../../assets/hero_2.jpg';
import hero3 from '../../assets/hero_3.jpg';
import hero4 from '../../assets/hero_4.jpg';
import hero5 from '../../assets/hero_5.jpg';

function Hero() {
  const navigate = useNavigate(); // 📌 Hook para la navegación

  return (
    <section className="hero-section">
      <div className="hero-content fade-in-once">
        <h1>
          Bienvenido a <span className="highlight">EcoVida</span>
        </h1>
        <p>Impulsando la agricultura orgánica y sostenible</p>
        <button onClick={() => navigate("/productos-publico")} className="btn btn-primary btn-lg pulse">
          Ver Productos
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        effect="fade"
        className="hero-carousel"
      >
        {[hero1, hero2, hero3, hero4, hero5].map((image, index) => (
          <SwiperSlide key={index}>
            <div className="hero-slide">
              <img src={image} alt={`Slide ${index + 1}`} className="hero-image" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Hero;
