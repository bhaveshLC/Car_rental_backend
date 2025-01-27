pipeline {
    agent any
    tools {
        nodejs '20.17.0'  // Ensures Node.js version 20.17.0 is used
    }
    stages {
        stage('print versions') {
            steps {
                sh 'npm version'  // Print npm version
            }
        }
        stage('Install') {
            steps {
                sh 'npm install'  // Install npm dependencies
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'  // Run build command
            }
        }
    }
}
