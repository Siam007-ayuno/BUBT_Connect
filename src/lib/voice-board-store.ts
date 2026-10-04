'use client'

import { useState, useEffect } from 'react'
import { INITIAL_POSTS, INITIAL_COMMENTS, type ExtendedPost, type ExtendedComment, DEMO_USERS } from '@/lib/demo-data'
import { ESCALATION_THRESHOLD } from '@/lib/constants'

const STORAGE_KEY_POSTS = 'bubt_voice_board_posts_v1'
const STORAGE_KEY_COMMENTS = 'bubt_voice_board_comments_v1'
const STORAGE_KEY_VOTES = 'bubt_user_votes_v1'
const STORAGE_KEY_BOOKMARKS = 'bubt_user_bookmarks_v1'

// Event bus for cross-component reactivity
const listeners = new Set<() => void>()
function notify() {
  listeners.forEach((listener) => listener())
}

export function getStoredPosts(): ExtendedPost[] {
  if (typeof window === 'undefined') return INITIAL_POSTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_POSTS))
      return INITIAL_POSTS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_POSTS
  }
}

export function saveStoredPosts(posts: ExtendedPost[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts))
    notify()
  } catch (err) {
    console.error('Failed to save posts', err)
  }
}

export function getStoredComments(): Record<string, ExtendedComment[]> {
  if (typeof window === 'undefined') return INITIAL_COMMENTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMMENTS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(INITIAL_COMMENTS))
      return INITIAL_COMMENTS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_COMMENTS
  }
}

export function saveStoredComments(comments: Record<string, ExtendedComment[]>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments))
    notify()
  } catch (err) {
    console.error('Failed to save comments', err)
  }
}

export function useVoiceBoardStore() {
  const [posts, setPosts] = useState<ExtendedPost[]>(INITIAL_POSTS)
  const [commentsMap, setCommentsMap] = useState<Record<string, ExtendedComment[]>>(INITIAL_COMMENTS)

  useEffect(() => {
    // Sync with localStorage on client mount to eliminate SSR hydration mismatch
    setPosts(getStoredPosts())
    setCommentsMap(getStoredComments())

    const update = () => {
      setPosts(getStoredPosts())
      setCommentsMap(getStoredComments())
    }
    listeners.add(update)
    return () => {
      listeners.delete(update)
    }
  }, [])

  // Vote on a post
  const votePost = (postId: string, direction: 1 | -1) => {
    const current = getStoredPosts()
    const updated = current.map((p) => {
      if (p.id !== postId) return p

      let newVote: number = direction
      let upDelta = 0
      let downDelta = 0

      if (p.userVote === direction) {
        // Toggle off
        newVote = 0
        if (direction === 1) upDelta = -1
        else downDelta = -1
      } else if (p.userVote === (direction === 1 ? -1 : 1)) {
        // Switching from opposite
        if (direction === 1) {
          upDelta = 1
          downDelta = -1
        } else {
          upDelta = -1
          downDelta = 1
        }
      } else {
        // New vote
        if (direction === 1) upDelta = 1
        else downDelta = 1
      }

      const newUp = Math.max(0, p.upvote_count + upDelta)
      const newDown = Math.max(0, p.downvote_count + downDelta)
      const shouldEscalate = newUp >= ESCALATION_THRESHOLD

      return {
        ...p,
        upvote_count: newUp,
        downvote_count: newDown,
        userVote: newVote,
        is_escalated: shouldEscalate,
      }
    })
    saveStoredPosts(updated)
  }

  // Toggle bookmark on a post
  const toggleBookmark = (postId: string) => {
    const current = getStoredPosts()
    const updated = current.map((p) => {
      if (p.id !== postId) return p
      return {
        ...p,
        isBookmarked: !p.isBookmarked,
      }
    })
    saveStoredPosts(updated)
  }

  // Add a new post
  const addPost = (newPost: Omit<ExtendedPost, 'id' | 'created_at' | 'updated_at' | 'upvote_count' | 'downvote_count' | 'comment_count'>) => {
    const id = `post-${Date.now()}`
    const post: ExtendedPost = {
      ...newPost,
      id,
      upvote_count: 1, // creator auto-upvote
      downvote_count: 0,
      comment_count: 0,
      userVote: 1,
      isBookmarked: false,
      is_escalated: false,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status_timeline: [
        {
          status: 'open',
          date: new Date().toLocaleString(),
          actor: newPost.is_anonymous ? 'Anonymous Student' : (newPost.author?.full_name || 'Community Member'),
          note: 'Issue created and posted to Voice Board.',
        },
      ],
    }
    const current = getStoredPosts()
    saveStoredPosts([post, ...current])
    return post
  }

  // Update post status (Authority / Super Admin action)
  const updatePostStatus = (
    postId: string,
    newStatus: 'open' | 'under_review' | 'in_progress' | 'resolved' | 'rejected',
    actorName: string,
    publicNote: string
  ) => {
    const current = getStoredPosts()
    const updated = current.map((p) => {
      if (p.id !== postId) return p
      const timeline = p.status_timeline || []
      return {
        ...p,
        status: newStatus,
        status_timeline: [
          ...timeline,
          {
            status: newStatus,
            date: new Date().toLocaleString(),
            actor: actorName,
            note: publicNote,
          },
        ],
      }
    })
    saveStoredPosts(updated)
  }

  // Add official response (Authority action)
  const addOfficialResponse = (
    postId: string,
    responseBody: string,
    authorityName: string,
    role: string,
    avatarUrl: string
  ) => {
    const current = getStoredPosts()
    const updated = current.map((p) => {
      if (p.id !== postId) return p
      return {
        ...p,
        official_response: {
          id: `resp-${Date.now()}`,
          author_name: authorityName,
          author_role: role,
          avatar_url: avatarUrl,
          body: responseBody,
          created_at: new Date().toISOString(),
        },
      }
    })
    saveStoredPosts(updated)
  }

  // Add a comment to a post
  const addComment = (
    postId: string,
    body: string,
    author: ExtendedComment['author'],
    parentId: string | null = null,
    isAnonymous: boolean = false,
    isOfficial: boolean = false
  ) => {
    const comments = getStoredComments()
    const postComments = comments[postId] || []

    const newComment: ExtendedComment = {
      id: `cmt-${Date.now()}`,
      post_id: postId,
      author_id: author?.id || 'anon-id',
      parent_id: parentId,
      body,
      is_official_response: isOfficial,
      is_anonymous: isAnonymous,
      upvote_count: 0,
      attachments: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: isAnonymous ? null : author,
      replies: [],
      userVote: 0,
    }

    let updatedList: ExtendedComment[]
    if (!parentId) {
      updatedList = [...postComments, newComment]
    } else {
      // Add as nested reply
      updatedList = postComments.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newComment],
          }
        }
        return c
      })
    }

    comments[postId] = updatedList
    saveStoredComments(comments)

    // Increment post comment count
    const posts = getStoredPosts()
    const updatedPosts = posts.map((p) => {
      if (p.id !== postId) return p
      return { ...p, comment_count: p.comment_count + 1 }
    })
    saveStoredPosts(updatedPosts)

    return newComment
  }

  // Vote on a comment
  const voteComment = (postId: string, commentId: string) => {
    const comments = getStoredComments()
    const postComments = comments[postId] || []

    const updateInList = (list: ExtendedComment[]): ExtendedComment[] => {
      return list.map((c) => {
        if (c.id === commentId) {
          const hasVoted = c.userVote === 1
          return {
            ...c,
            upvote_count: hasVoted ? c.upvote_count - 1 : c.upvote_count + 1,
            userVote: hasVoted ? 0 : 1,
          }
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: updateInList(c.replies),
          }
        }
        return c
      })
    }

    comments[postId] = updateInList(postComments)
    saveStoredComments(comments)
  }

  return {
    posts,
    commentsMap,
    votePost,
    toggleBookmark,
    addPost,
    updatePostStatus,
    addOfficialResponse,
    addComment,
    voteComment,
  }
}
