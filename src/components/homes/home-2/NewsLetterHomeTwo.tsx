"use client"



type DataType = {
  sub_title: string;
  title: string;
  sm_info: string;
}
const news_content: DataType = {
  sub_title: "Patient engagement",
  title: "Stay connected with clinic updates.",
  sm_info: "Capture opt-in interest for appointment reminders, wellness updates, feedback requests, and reception callback workflows.",

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
