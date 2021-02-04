type MergeBase<T, TT> = T & Omit<TT, keyof T>;
/**
 * Merges types together.
 *
 * Any conflicts in keys are resolved to the first instance of that key.
 */
export type Merge<T1, T2, T3 = void, T4 = void, T5 = void, T6 = void, T7 = void> =
    MergeBase<T1, MergeBase<T2, MergeBase<T3, MergeBase<T4, MergeBase<T5, MergeBase<T6, T7>>>>>>;