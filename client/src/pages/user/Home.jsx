import style from "./home.module.css"

function Home() {
    return (
        <main className={style.home}>
            {/* Hero Section */}
            <section className={style.hero}>
                <div className={style.container}>
                    <h1>Welcome to Our Creative Space</h1>
                    <p>Building meaningful experiences with React and CSS Modules.</p>
                </div>
            </section>

            {/* Featured Section */}
            <section className={style.featured}>
                <div className={style.container}>
                    <h2>Explore Features</h2>
                    
                    <div className={style.featuredItem}>
                        {Array.from({length: 4}).map((_, index)=>(
                            <article key={index} className={style.featuredCard}>
                                <div className={style.iconPlaceholder}></div>
                                <h3>Service {index + 1}</h3>
                                <p style={{color: '#666', marginTop: '10px'}}>
                                    Deskripsi singkat mengenai fitur atau layanan yang ditawarkan di sini.
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Home