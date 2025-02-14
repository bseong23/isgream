package com.ssafy.iscream.board.service;

import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.board.domain.PostImage;
import com.ssafy.iscream.board.repository.PostImageRepository;
import com.ssafy.iscream.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostImageService {

    private final S3Service s3Service;
    private final PostImageRepository postImageRepository;

    // 게시글 이미지 저장
    public void saveImages(Post post, List<MultipartFile> files) {
        if (files != null && !files.isEmpty()) {
            List<String> imageUrls = s3Service.uploadImage(files);

            List<PostImage> postImages = imageUrls.stream()
                    .map(url -> PostImage.builder().imageUrl(url).postId(post.getPostId()).build())
                    .collect(Collectors.toList());

            postImageRepository.saveAll(postImages);
        }
    }

    // 게시글 이미지 수정
    public void updateImages(Post post, List<String> deleteFiles, List<MultipartFile> files) {
        if (!deleteFiles.isEmpty()) {
            s3Service.deleteFile(deleteFiles);
            postImageRepository.deleteByImageUrlIn(deleteFiles);
        }

        saveImages(post, files);
    }

    // 게시글 이미지 삭제
    public void deleteImages(Integer postId) {
        List<PostImage> images = postImageRepository.findAllByPostId(postId);
        s3Service.deleteFile(images.stream().map(PostImage::getImageUrl).collect(Collectors.toList()));
        postImageRepository.deleteAllByPostId(postId);
    }

    // 게시글 이미지 목록 조회
    public List<String> getImages(Integer postId) {
        List<PostImage> images = postImageRepository.findAllByPostId(postId);
        return images.stream().map(PostImage::getImageUrl).collect(Collectors.toList());
    }

    // 게시글 썸네일 조회
    public String getThumbnail(Integer postId) {
        PostImage image = postImageRepository.findFirstByPostId(postId);
        return image != null ? image.getImageUrl() : null;
    }
}

