import styles from './footer.module.css'

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Bagian Kiri: Logo & Deskripsi */}
                <div className={styles.logoSection}>
                    <h1>LOGO</h1>
                    <p className={styles.description}>
                        Kami berdedikasi untuk memberikan solusi digital terbaik melalui inovasi 
                        dan teknologi modern. Bergabunglah dengan perjalanan kami.
                    </p>
                    <div className={styles.socials}>
                        <div className={styles.socialIcon} title="Facebook">FB</div>
                        <div className={styles.socialIcon} title="Instagram">IG</div>
                        <div className={styles.socialIcon} title="LinkedIn">IN</div>
                        <div className={styles.socialIcon} title="Twitter">X</div>
                    </div>
                </div>

                {/* Bagian Kanan: Link Navigasi */}
                <div className={styles.links}>
                    <div className={styles.navGroup}>
                        <h3>Company</h3>
                        <ul>
                            <li>Home</li>
                            <li>About Us</li>
                            <li>Product</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>

                    <div className={styles.navGroup}>
                        <h3>Get In Touch</h3>
                        <ul>
                            <li>+62 123-1111-0082</li>
                            <li>calvin@email.com</li>
                            <li>Jakarta, Indonesia</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.copyright}>
                <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer