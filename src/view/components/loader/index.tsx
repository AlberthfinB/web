import styles from './Loader.module.css';

export default function Loader() {
   return (
      <div className="flex items-center justify-center">
         <div className={styles.loader}></div>
      </div>
   )
};