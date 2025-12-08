import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from "react";

interface BootstrapTask {
  id: string;
  promise: Promise<void>;
  resolved: boolean;
}

interface AppBootstrapContextValue {
  isBootstrapComplete: boolean;
  isCoreReady: boolean;
  registerTask: (taskId: string, promise: Promise<void>) => void;
  markCoreReady: () => void;
  getTaskStatus: (taskId: string) => boolean;
}

const AppBootstrapContext = createContext<AppBootstrapContextValue | undefined>(undefined);

interface AppBootstrapProviderProps {
  children: ReactNode;
  onBootstrapComplete?: () => void;
}

export function AppBootstrapProvider({ children, onBootstrapComplete }: AppBootstrapProviderProps) {
  const [isBootstrapComplete, setIsBootstrapComplete] = useState(true);
  const [isCoreReady, setIsCoreReady] = useState(false);
  const tasksRef = useRef<Map<string, BootstrapTask>>(new Map());
  const resolvedTasksRef = useRef<Set<string>>(new Set());
  const hasRegisteredTasksRef = useRef(false);

  const checkAllTasksComplete = useCallback(() => {
    const allTasks = Array.from(tasksRef.current.values());
    if (allTasks.length === 0) return true;
    return allTasks.every((task) => task.resolved);
  }, []);

  const registerTask = useCallback((taskId: string, promise: Promise<void>) => {
    if (tasksRef.current.has(taskId)) {
      return;
    }

    if (!hasRegisteredTasksRef.current) {
      hasRegisteredTasksRef.current = true;
      setIsBootstrapComplete(false);
    }

    const task: BootstrapTask = {
      id: taskId,
      promise,
      resolved: false,
    };

    tasksRef.current.set(taskId, task);

    promise
      .then(() => {
        const existingTask = tasksRef.current.get(taskId);
        if (existingTask) {
          existingTask.resolved = true;
          resolvedTasksRef.current.add(taskId);
        }

        if (checkAllTasksComplete()) {
          setIsBootstrapComplete(true);
          onBootstrapComplete?.();
        }
      })
      .catch((error) => {
        console.error(`[AppBootstrap] Task ${taskId} failed:`, error);
        const existingTask = tasksRef.current.get(taskId);
        if (existingTask) {
          existingTask.resolved = true;
          resolvedTasksRef.current.add(taskId);
        }

        if (checkAllTasksComplete()) {
          setIsBootstrapComplete(true);
          onBootstrapComplete?.();
        }
      });
  }, [checkAllTasksComplete, onBootstrapComplete]);

  const markCoreReady = useCallback(() => {
    setIsCoreReady(true);
  }, []);

  const getTaskStatus = useCallback((taskId: string) => {
    return resolvedTasksRef.current.has(taskId);
  }, []);

  return (
    <AppBootstrapContext.Provider
      value={{
        isBootstrapComplete,
        isCoreReady,
        registerTask,
        markCoreReady,
        getTaskStatus,
      }}
    >
      {children}
    </AppBootstrapContext.Provider>
  );
}

export function useAppBootstrap() {
  const context = useContext(AppBootstrapContext);
  if (context === undefined) {
    throw new Error("useAppBootstrap must be used within an AppBootstrapProvider");
  }
  return context;
}

export function useBootstrapTask(taskId: string, asyncFn: () => Promise<void>, deps: React.DependencyList = []) {
  const { registerTask } = useAppBootstrap();
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!registeredRef.current) {
      registeredRef.current = true;
      const promise = asyncFn();
      registerTask(taskId, promise);
    }
  }, [taskId, registerTask, ...deps]);
}

export default AppBootstrapContext;
