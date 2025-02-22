import styles from './styles.module.css';

export const UserComment = ({review}) =>{
    return(

        <div className={styles.card}>
            <div className={styles.img} style={!review?.avatarViewer ? { background: 'linear-gradient(#d7cfcf, #9198e5)'} : {}}>
                <img src={review?.avatarViewer} alt="" style={{width: '50px'}}/>
            </div>
            <div className={styles.textBox}>
                <div className={styles.textContent}>
                    <p className={styles.h1} style={{margin: '5px 0'}}>{review?.reviewer}</p>
                    <span className={styles.span}>12 min ago</span>
                </div>
                <p className={styles.p} style={{margin: '0 0 15px 0'}}>{review?.Review}</p>
            </div>
        </div>

    )
}