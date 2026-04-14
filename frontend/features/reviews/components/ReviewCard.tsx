import useFetchUserById from '@/features/users/hooks/useFetchUserById';
import { Review } from '@/features/reviews/hooks/useFetchUserReviews';
import StarRating from './StarRating';
import styles from './ReviewCard.module.scss';
import Spinner from '@/components/Spinner';

export default function ReviewCard({ review }: { review: Review }) {
  const { userFullName: customerFullName, isUserLoading } = useFetchUserById(review.customerId);

  if (isUserLoading) return <Spinner centered={true} />;

  return (
    <div className={styles['review-card']}>
      <div className={styles.header}>
        <div className={styles['user-info']}>
          <div className={styles.avatar}>{customerFullName?.charAt(0).toUpperCase() ?? '?'}</div>
          <span className={styles.name}>{customerFullName ?? '...'}</span>
        </div>
        <span className={styles.date}>
          {new Date(review.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>

      <StarRating rating={review.rating} />

      {review.comment && <p className={styles.comment}>&quot;{review.comment}&quot;</p>}
    </div>
  );
}
