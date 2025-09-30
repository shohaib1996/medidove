"use client"



type DataType = {
  sub_title: string;
  title: string;
  sm_info: string;
}
const news_content: DataType = {
  sub_title: "Subscribe For Get Update",
  title: "Let's Find An Office Near You.",
  sm_info: "incididunt ipsum dolor sit amet, consectetur adipisicing elit, sed do eius mod tempor  ut labore et lorem dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",

}
const {sub_title, title, sm_info}  = news_content

const NewsLetterHomeTwo = () => {
  return (
    <>
      <section className="news-letter-area pt-120 pb-120"  style={{backgroundImage: `url(/assets/img/newsletter/news-letter-bg.jpg)`}}>
        <div className="container">
          <div className="row">
            <div className="col-xl-6 offset-xl-6 col-lg-8 offset-lg-4">
              <div className="news-letter-box">
                <div className="about-title news-letter-title mb-20">
                  <h5 className="pink-color">{sub_title}</h5>
                  <h1>{title}</h1>
                </div>
                <div className="news-letter-text mb-30">
                  <p>{sm_info}</p>
                </div>
                <div className="subscribe-form">
                  <form onSubmit={e => e.preventDefault()}>
                    <input type="text" placeholder="Enter your email address" />
                      <button className="primary_btn btn" type="submit">Subscribe</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsLetterHomeTwo;