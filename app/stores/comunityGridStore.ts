import {create} from 'zustand'
import type { CommunityGridStore,CommunityGridPostNode} from '~/types/comunityGrid'

export const  useComunityGrid = create<CommunityGridStore>((set)=>({
  posts: null ,
  setPosts:(newPosts: CommunityGridPostNode[])=>{
    set(()=>({
      posts:newPosts
    }))
  },
}))
