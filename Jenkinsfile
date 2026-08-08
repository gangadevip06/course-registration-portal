// ==========================================================
// Jenkinsfile - Declarative Pipeline
// Project: Course Registration Portal (React + Vite)
// ==========================================================

pipeline {
    agent any

    tools {
        // Requires a NodeJS installation configured in
        // Manage Jenkins > Tools > NodeJS installations, named "NodeJS"
        nodejs 'NodeJS'
    }

    environment {
        APP_NAME   = 'course-registration-portal'
        BUILD_DIR  = 'dist'
    }

    options {
        timestamps()
        skipDefaultCheckout(false)
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out source code for ${APP_NAME}..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                echo 'Building the React application with Vite...'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running test suite (placeholder — add real tests as the project grows)...'
                // Replace with: sh 'npm test' once a test suite is configured.
                sh 'echo "No automated tests configured yet. Skipping..."'
            }
        }

        stage('Archive Build') {
            steps {
                echo 'Archiving production build artifacts...'
                archiveArtifacts artifacts: "${BUILD_DIR}/**", fingerprint: true, allowEmptyArchive: false
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy stage placeholder — plug in your deployment target here.'
                // Example options:
                // sh 'rsync -av dist/ user@server:/var/www/course-portal/'
                // sh 'aws s3 sync dist/ s3://my-bucket-name --delete'
                // sh 'docker build -t course-registration-portal:latest .'
                sh 'echo "Deployment step not configured. Add your deployment commands here."'
            }
        }
    }

    post {
        success {
            echo "✅ SUCCESS: ${APP_NAME} was built and archived successfully!"
        }
        failure {
            echo "❌ FAILURE: The pipeline failed. Check the logs above for details."
        }
        always {
            echo "Pipeline finished for ${APP_NAME} — Build #${env.BUILD_NUMBER}"
        }
    }
}
