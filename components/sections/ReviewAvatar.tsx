import Image from "next/image";
import type { Review } from "@/content/site";
import { publicAssetPath } from "@/content/asset-path";

export function ReviewAvatar({ review, prominent = false }: { review: Review; prominent?: boolean }) {
  const photo = review.avatar;
  if (photo.src && photo.clientVerified && photo.republishingApproved) {
    return <span className="review-avatar"><Image src={publicAssetPath(photo.src)} alt={photo.alt} fill sizes={prominent ? "(max-width: 760px) 76px, 160px" : "(max-width: 760px) 50px, 52px"} loading={prominent ? "eager" : "lazy"} /></span>;
  }
  return <span className="review-avatar review-avatar--placeholder" aria-label={`Фото ${review.name} не опубликовано`} role="img">{review.name[0]}</span>;
}
