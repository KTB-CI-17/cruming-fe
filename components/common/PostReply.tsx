import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReplyItem from './ReplyItem';

type Comment = {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
};

interface PostReplyProps {
    comments: Comment[];
}

export default function PostReply({ comments }: PostReplyProps) {
    return (
        <View style={styles.container}>
            {comments.map((comment) => (
                <ReplyItem
                    key={comment.id}
                    authorName={comment.authorName}
                    content={comment.content}
                    createdAt={comment.createdAt}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
